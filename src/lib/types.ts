export type Property = {
  id: string;
  title: string;
  description: string | null;
  property_type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number | null;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  virtual_tour_url: string | null;
  amenities: string[];
  realtor_id: string | null;
  realtor_name: string | null;
  realtor_email: string | null;
  realtor_phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  zip_code: string | null;
  preferred_property_types: string[];
  min_price: number;
  max_price: number;
  min_bedrooms: number;
  max_bedrooms: number;
  min_bathrooms: number;
  max_bathrooms: number;
  amenities: string[];
  created_at: string;
  updated_at: string;
};

export type PropertyLike = {
  id: string;
  user_id: string;
  property_id: string;
  liked: boolean;
  created_at: string;
};

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  property_id: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  realtor_id: string;
  property_id: string | null;
  last_message_at: string;
  created_at: string;
};

export type Filters = {
  country: string;
  state: string;
  city: string;
  zipCode: string;
  propertyTypes: string[];
  minPrice: number;
  maxPrice: number;
  minBedrooms: number;
  maxBedrooms: number;
  minBathrooms: number;
  maxBathrooms: number;
  amenities: string[];
};
