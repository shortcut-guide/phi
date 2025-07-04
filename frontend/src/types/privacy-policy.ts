export interface Section {
  title: string;
  description: string;
}

export interface PrivacyPolicy {
  heading: string;
  description: string;
  sections: Record<string, Section>;
}