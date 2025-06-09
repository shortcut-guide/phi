export interface ExternalAccount {
    id: string;
    user_id: string;
    provider: string;
    external_user_id: string;
    access_token?: string;
    refresh_token?: string;
    expires_at?: string;
    linked_at: string;
}
