import { IMAGES_URL } from "../api.js";

export const imageApi = {
    getImageUrl: (imageName) => `${IMAGES_URL}/${imageName}`,
}