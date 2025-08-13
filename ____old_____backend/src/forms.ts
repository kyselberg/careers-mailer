const PHP_DEV = "php-dev";
const SALES_MANAGER = "sales-manager";
const COMPLIANCE_MANAGER = "compliance-manager";
const CONTENT_MARKETING_MANAGER = "content-marketing-manager";
const HEAD_OF_CREATOR_SUCCESS = "head-of-creator-success";

export const FORM_IDS = {
  phpDev: PHP_DEV,
  salesManager: SALES_MANAGER,
  complianceManager: COMPLIANCE_MANAGER,
  contentMarketingManager: CONTENT_MARKETING_MANAGER,
  headOfCreatorSuccess: HEAD_OF_CREATOR_SUCCESS,
};

export const forms = {
  [PHP_DEV]: "doncerber@gmail.com",
  [SALES_MANAGER]: "breezy-23123@breezy.hr",
  [COMPLIANCE_MANAGER]: "breezy-23123@breezy.hr",
  [CONTENT_MARKETING_MANAGER]: "breezy-23123@breezy.hr",
  [HEAD_OF_CREATOR_SUCCESS]: "breezy-23123@breezy.hr",
};

/**
 * Get recipient email for a specific form ID
 * @param formId - The form identifier
 * @returns The recipient email address
 * @throws Error if form ID is not found
 */
export const getRecipientEmail = (formId: string): string => {
  const recipientEmail = forms[formId as keyof typeof forms];

  if (!recipientEmail) {
    throw new Error(`Invalid form ID: ${formId}. Valid form IDs are: ${Object.keys(forms).join(', ')}`);
  }

  return recipientEmail;
};

/**
 * Check if a form ID is valid
 * @param formId - The form identifier to validate
 * @returns true if the form ID exists, false otherwise
 */
export const isValidFormId = (formId: string): boolean => {
  return formId in forms;
};