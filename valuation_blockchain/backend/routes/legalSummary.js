const express = require('express');
const { createGenAIClient } = require('../services/gemini');
const { GEMINI_API_KEYS, GEMINI_API_KEY, getNextGeminiKey } = require('../config');

const router = express.Router();

// =============================================================
// 8. AI LEGAL TITLE SUMMARY ENDPOINT (GEMINI)
// =============================================================

/**
 * POST /api/generate-title-summary
 *
 * Accepts: { propertyId, oldOwner, newOwner, propertyValue, transferDate }
 * Returns: { success, summary } - a 2-3 sentence AI-generated legal title summary
 * confirming the ownership transfer, cleared taxes, and validated registration.
 */
router.post('/api/generate-title-summary', async (req, res) => {
    try {
        console.log('\n============================================');
        console.log('🤖 AI LEGAL TITLE SUMMARY REQUEST RECEIVED');
        console.log('============================================');
        console.log(req.body);

        const { propertyId, oldOwner, newOwner, propertyValue, transferDate } = req.body;

        // --- Input Validation ---
        if (!propertyId || !oldOwner || !newOwner || !propertyValue || !transferDate) {
            return res.status(400).json({
                error: 'Missing required fields: propertyId, oldOwner, newOwner, propertyValue, transferDate',
            });
        }

        // --- Guard: Ensure API key is configured ---
        if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            return res.status(503).json({
                error: 'Gemini API key not configured.',
                details: 'Set the GEMINI_API_KEY environment variable before starting the server.',
            });
        }

        // --- Craft the formal municipal registrar prompt ---
        const prompt = `You are a formal Senior Municipal Registrar at the Sri Lanka Local Government Rating Authority. 
Your duty is to produce official, legally precise property title transfer summaries.

A property ownership transfer has been successfully recorded on the immutable blockchain ledger. 
You must generate an official Legal Title Summary based on the following verified transaction data:

- Property Registration Number : ${propertyId}
- Transferring Party (Previous Owner) : ${oldOwner}
- Acquiring Party (New Owner)         : ${newOwner}
- Assessed Capital Value              : LKR ${Number(propertyValue).toLocaleString()}
- Date of Transfer                    : ${transferDate}

Instructions:
1. Write exactly 2 to 3 sentences in formal legal language.
2. Confirm the transfer of ownership from the previous party to the acquiring party.
3. Explicitly state that all outstanding rating tax obligations have been fully settled and cleared prior to registration.
4. Assert that the transfer has been validated and permanently inscribed on the municipal blockchain registry.
5. Do NOT include headings, bullet points, markdown, or any prefix - output only the summary paragraph itself.`;

        console.log('\n📝 PROMPT CRAFTED. Calling Gemini API...');

        // --- Call Gemini with key rotation + retry + timeout ---
        const GEMINI_TIMEOUT_MS = 15000; // 15 seconds per attempt
        const MAX_RETRIES = Math.max(GEMINI_API_KEYS.length, 2); // retry once per key
        const GEMINI_MODEL = 'gemini-2.0-flash'; // generous free tier: 1500 req/day

        let lastError = null;
        let result = null;

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            const apiKey = getNextGeminiKey();
            const client = createGenAIClient(apiKey);
            const keyLabel = `key#${(attempt + 1) % GEMINI_API_KEYS.length || 1}`;

            try {
                if (attempt > 0) {
                    const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 8000); // 1s, 2s, 4s, 8s
                    console.log(`   ⏳ Retry ${attempt}/${MAX_RETRIES - 1} using ${keyLabel} (backoff ${backoffMs}ms)...`);
                    await new Promise((resolve) => setTimeout(resolve, backoffMs));
                } else {
                    console.log(`   Using ${keyLabel} (model: ${GEMINI_MODEL})`);
                }

                const geminiCall = client.models.generateContent({
                    model: GEMINI_MODEL,
                    contents: prompt,
                });

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Gemini API request timed out after 15 seconds')), GEMINI_TIMEOUT_MS)
                );

                result = await Promise.race([geminiCall, timeoutPromise]);
                break; // success - stop retrying
            } catch (err) {
                lastError = err;
                const isQuota =
                    err.message &&
                    (err.message.includes('429') ||
                        err.message.includes('RESOURCE_EXHAUSTED') ||
                        err.message.includes('quota'));
                if (isQuota && attempt < MAX_RETRIES - 1) {
                    console.warn(`   ⚠️  ${keyLabel} quota exceeded - rotating to next key...`);
                    continue;
                }
                throw err; // non-quota error or all keys exhausted
            }
        }

        if (!result) throw lastError || new Error('All Gemini keys exhausted or failed');

        const summary = result.text.trim();

        console.log('\n✅ LEGAL SUMMARY GENERATED:');
        console.log(`   ${summary}`);
        console.log('============================================\n');

        res.json({
            success: true,
            summary,
            propertyId,
            transferDate,
            model: 'gemini-1.5-flash',
        });
    } catch (error) {
        console.error('\n❌ GEMINI API ERROR:');
        console.error(error.message);
        console.error('============================================\n');

        // --- Fallback: return a template-based summary so the UI still works ---
        const isQuotaError =
            error.message &&
            (error.message.includes('429') ||
                error.message.includes('RESOURCE_EXHAUSTED') ||
                error.message.includes('quota'));
        const isTimeout = error.message && error.message.includes('timed out');

        const reason = isTimeout
            ? '(AI service timed out)'
            : isQuotaError
                ? '(AI quota exhausted - template used)'
                : '(AI service unavailable)';

        const { propertyId, oldOwner, newOwner, transferDate } = req.body || {};
        const fallbackSummary =
            `This is to certify that Property Registration Number ${propertyId || 'N/A'} has been ` +
            `officially transferred from the Transferring Party (${oldOwner || 'N/A'}) to the Acquiring Party ` +
            `(${newOwner || 'N/A'}) on ${transferDate || 'the recorded date'}, in accordance with ` +
            `the applicable provisions of the Sri Lanka Local Government Rating Authority. ` +
            `All outstanding rating tax obligations have been fully settled and cleared prior to this registration. ` +
            `This transfer has been validated and is permanently inscribed on the municipal blockchain registry.`;

        console.log(`\n⚠️  Using fallback template summary ${reason}`);

        return res.json({
            success: true,
            summary: fallbackSummary,
            propertyId,
            transferDate,
            model: 'template-fallback',
            warning: `AI summary unavailable ${reason}. A standard template was used.`,
        });
    }
});

module.exports = router;
