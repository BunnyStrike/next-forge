export type ApiResult<T> = {
  data: T;
} | {
  error: string;
};

export type UserInfo = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
};

export type PageInfo = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OrganizationInfo = {
  id: string;
  name: string;
  slug: string;
};

export type MembershipInfo = {
  id: string;
  role: string;
  user: UserInfo;
  organization: OrganizationInfo;
}; 