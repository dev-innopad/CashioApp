// services/addressService.ts
import axios from 'axios';

export const endPoints = {
  addressSuggestions: 'https://photon.komoot.io/api/',
};

export const fetchAddressSuggestions = async (query: string) => {
  if (!query || query.length < 3) return [];

  try {
    const res = await axios.get(endPoints.addressSuggestions, {
      params: {
        q: query,
        limit: 5,
        lang: 'en',
      },
    });

    return res.data.features.map((item: any) => ({
      label: item.properties.name,
      fullAddress: [
        item.properties.name,
        item.properties.city,
        item.properties.state,
        item.properties.country,
      ]
        .filter(Boolean)
        .join(', '),
    }));
  } catch (error) {
    console.log('Address fetch error', error);
    return [];
  }
};
