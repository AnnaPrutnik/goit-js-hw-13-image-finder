import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal';

export async function fetchImageByName(query, page) {
  const {
    data: { hits },
  } = await axios.get(
    `&q=${query}&page=${page}&per_page=12&key=23114500-22e254b478d4c1f3e17503cc3`,
  );
  return hits;
}
