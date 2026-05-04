import CouncilHeader from './CouncilHeader';
import AssessmentForm from './AssessmentForm';
import AssessmentStatus from './AssessmentStatus';

const AssessmentSection = ({
  form,
  setForm,
  handleOwnershipDocsChange,
  handlePropertyImagesChange,
  handleSubmit,
  loading,
  status,
}) => (
  <div>
    <CouncilHeader />
    <AssessmentForm
      form={form}
      setForm={setForm}
      handleOwnershipDocsChange={handleOwnershipDocsChange}
      handlePropertyImagesChange={handlePropertyImagesChange}
      handleSubmit={handleSubmit}
      loading={loading}
    />
    <AssessmentStatus status={status} />
  </div>
);

export default AssessmentSection;
