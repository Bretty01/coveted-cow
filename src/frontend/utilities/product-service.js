import http from "../http-common.js";

class ProductService {

    getQuery(query = "") {
        return http.get(query)
    }

    getById(id) {
        return http.get(`/product/${id}`)
    }

    getBrandList() {
        return http.get(`/brand`)
    }

    find(query, by = "name", page = 0) {
        return http.get(`?${by}=${query}&page=${page}`)
    }

    submitReview(productId, reviewTitle, reviewScore, reviewDescription, userId) {
        return http.post("/submitreview", {
            "productId": productId,
            "reviewTitle": reviewTitle,
            "reviewScore": reviewScore,
            "reviewDescription": reviewDescription,
            "userId": userId
        })
    }
}
export default new ProductService()