import Button from '../../../components/Button';
import InputField from '../../../components/InputField';
import SelectField from '../../../components/SelectField';

const AssessmentForm = ({
  form,
  setForm,
  handleOwnershipDocsChange,
  handlePropertyImagesChange,
  handleSubmit,
  loading,
}) => (
  <form onSubmit={handleSubmit} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        label="Property ID"
        required
        type="number"
        placeholder="e.g., 101"
        value={form.propertyId}
        onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
      />

      <InputField
        label="Property Address"
        required
        placeholder="e.g., 123 Main St, Colombo"
        value={form.propertyAddress}
        onChange={(e) => setForm({ ...form, propertyAddress: e.target.value })}
      />

      <SelectField
        label="Location Zone"
        required
        value={form.zone}
        onChange={(e) => setForm({ ...form, zone: e.target.value })}
      >
        <option value="A">Zone A - Luxury Residential (Rate: 8,000 LKR)</option>
        <option value="B">Zone B - Standard Residential (Rate: 6,000 LKR)</option>
        <option value="C">Zone C - Basic/Rural (Rate: 4,500 LKR)</option>
      </SelectField>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        label="Square Footage"
        required
        type="number"
        min="1"
        placeholder="e.g., 2000"
        value={form.sqFt}
        onChange={(e) => setForm({ ...form, sqFt: e.target.value })}
        helper="Total area of the property"
      />

      <InputField
        label="Building Age (Years)"
        required
        type="number"
        min="0"
        placeholder="e.g., 10"
        value={form.buildingAge}
        onChange={(e) => setForm({ ...form, buildingAge: e.target.value })}
        helper="📉 Critical: 2% depreciation per year (max 50%)"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        label="Land Size"
        required
        type="number"
        min="1"
        placeholder="e.g., 1200"
        value={form.landSize}
        onChange={(e) => setForm({ ...form, landSize: e.target.value })}
        helper="Use square meters or per council standard"
      />

      <InputField
        label="Estimated Value"
        type="number"
        min="0"
        placeholder="e.g., 25000000"
        value={form.estimatedValue}
        onChange={(e) => setForm({ ...form, estimatedValue: e.target.value })}
        helper="Optional (leave blank for auto-calculation)"
      />
    </div>

    <InputField
      label="Owner NIC"
      required
      placeholder="e.g., 199512345678 or 945671234V"
      value={form.nic}
      onChange={(e) => setForm({ ...form, nic: e.target.value })}
      helper="Citizen's National Identity Card number (Wallet will be auto-generated)"
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        label="Ownership or Legal Documents"
        required
        type="file"
        accept=".pdf,.doc,.docx,image/*"
        onChange={handleOwnershipDocsChange}
        helper="Upload deed, title, or legal proof (max 10MB)"
      />

      <InputField
        label="Property Images"
        required
        type="file"
        accept="image/*"
        multiple
        onChange={handlePropertyImagesChange}
        helper="Upload clear photos (front, side, inside, max 5MB each)"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        label="Latitude"
        required
        type="number"
        step="any"
        min="-90"
        max="90"
        placeholder="e.g., 6.9271"
        value={form.latitude}
        onChange={(e) => setForm({ ...form, latitude: e.target.value })}
      />

      <InputField
        label="Longitude"
        required
        type="number"
        step="any"
        min="-180"
        max="180"
        placeholder="e.g., 79.8612"
        value={form.longitude}
        onChange={(e) => setForm({ ...form, longitude: e.target.value })}
      />
    </div>

    <SelectField
      label="Status"
      required
      value={form.status}
      onChange={(e) => setForm({ ...form, status: e.target.value })}
    >
      <option value="Verified">Verified</option>
      <option value="Pending">Pending</option>
      <option value="Rejected">Rejected</option>
    </SelectField>

    {/* Algorithm Preview - Contractor's Test Method */}
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3 border-b-2 border-green-700">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h4 className="font-bold text-white">Contractor's Test Method Preview</h4>
        </div>
      </div>
      <div className="p-5 bg-white">
        <div className="text-sm text-green-700 space-y-2 font-mono">
          <p className="flex items-center gap-2">
            <span className="text-green-600 font-semibold">Gross Cost =</span>
            <span>
              {form.sqFt || '?'} sqft × {form.zone === 'A' ? '8,000' : form.zone === 'B' ? '6,000' : '4,500'} LKR/sqft
            </span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-lime-600 font-semibold">Depreciation =</span>
            <span>Gross Cost × ({form.buildingAge || '?'} years × 2%, max 50%)</span>
          </p>
          <div className="h-px bg-green-300 my-2"></div>
          <p className="flex items-center gap-2">
            <span className="text-emerald-600 font-semibold">ECV =</span>
            <span>Gross Cost - Depreciation</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-emerald-600 font-semibold">Annual Value =</span>
            <span>ECV × 5%</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-emerald-600 font-semibold">Tax =</span>
            <span>Annual Value × 10%</span>
          </p>
        </div>
      </div>
    </div>

    <Button type="submit" loading={loading} variant="council" className="w-full py-5 text-lg">
      <span className="flex items-center justify-center gap-2">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>{loading ? 'Processing Algorithm...' : 'Assess & Record on Blockchain'}</span>
      </span>
    </Button>
  </form>
);

export default AssessmentForm;
