export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface ProfileHook {
  user: ProfileUser | null;
  updating: boolean;
  handleLogout: () => void;
  takeProfilePhoto: () => Promise<void>;
  pickImageFromGallery: () => Promise<void>;
}
