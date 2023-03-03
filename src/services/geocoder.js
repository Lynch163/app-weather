function Geocoder(axios) {
  return {
    getCity(geocode) {
      return axios.get(
        `1.x?geocode=${geocode}&apikey=8ea89574-af63-4d0c-a423-99134e33a58f&format=json`
      );
    },
  };
}

export default Geocoder;
