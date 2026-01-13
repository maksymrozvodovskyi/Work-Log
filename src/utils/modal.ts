export const getButtonText = (
  isLoading: boolean,
  isEditing: boolean
): string => {
  if (isLoading) {
    return isEditing ? "Saving..." : "Creating...";
  }
  return isEditing ? "Save" : "Create";
};
