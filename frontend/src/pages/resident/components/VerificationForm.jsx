import Button from "../../../components/Button";
import InputField from "../../../components/InputField";

const VerificationForm = ({ pId, setPId, verifyProperty, loading }) => (
  <div className="mb-8">
    <div className="flex gap-3">
      <div className="flex-1">
        <InputField
          type="number"
          placeholder="Enter Property ID (e.g., 101)"
          value={pId}
          onChange={(e) => setPId(e.target.value)}
          className="text-lg"
        />
      </div>
      <Button
        onClick={verifyProperty}
        loading={loading}
        variant="primary"
        className="px-10 py-3 text-lg "
      >
        <span className="flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Verify Property</span>
        </span>
      </Button>
    </div>
  </div>
);

export default VerificationForm;
