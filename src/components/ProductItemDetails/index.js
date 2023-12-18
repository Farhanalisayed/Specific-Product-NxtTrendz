// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import ProductCard from '../ProductCard'
import './index.css'

const prodConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: prodConstants.initial,
    quantity: 1,
    productData: {},
    similarProducts: [],
  }

  componentDidMount() {
    this.getTheDamnProduct()
  }

  getTheDamnProduct = async () => {
    this.setState({apiStatus: prodConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: `Bearer ${jwtToken}`,
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        rating: data.rating,
        totalReviews: data.total_reviews,
        availability: data.availability,
        brand: data.brand,
        description: data.description,
      }
      const similarUpdatedData = data.similar_products.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        title: each.title,
        price: each.price,
        rating: each.rating,
        brand: each.brand,
      }))
      this.setState({
        productData: updatedData,
        similarProducts: similarUpdatedData,
        apiStatus: prodConstants.success,
      })
    } else {
      this.setState({
        apiStatus: prodConstants.failure,
      })
    }
  }

  redirectToShop = () => {
    const {history} = this.props
    history.push('/products')
  }

  onIncrement = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onDecrement = () => {
    this.setState(prevState => ({quantity: prevState.quantity - 1}))
  }

  renderProduct = () => {
    const {productData, quantity, similarProducts} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      availability,
      brand,
      description,
    } = productData

    return (
      <div className="the-container">
        <Header />
        <div className="upper-container">
          <img className="picture" src={imageUrl} alt="product" />
          <div className="text-container">
            <h1 className="heading">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="review-container">
              <div className="rating-cont">
                <p className="rating">{rating}</p>
                <img
                  className="star"
                  alt="star"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                />
              </div>
              <p className="review">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="availability">
              <span>Available</span>: {availability}
            </p>
            <p className="brand">
              <span>Brand</span>: {brand}
            </p>

            <hr />

            <div className="btn-container">
              <button
                onClick={this.onIncrement}
                data-testid="minus"
                className="btn"
              >
                <BsDashSquare className="iconny" />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                onClick={this.onDecrement}
                data-testid="plus"
                className="btn"
              >
                <BsPlusSquare className="iconny" />
              </button>
            </div>

            <button className="cart-btn">ADD TO CART</button>
          </div>
        </div>

        <div className="lower-container">
          <h1 className="products-heading">Similar Products</h1>
          <ul>
            {similarProducts.map(each => (
              <ProductCard productData={each} key={each.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="load-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="fail-container">
      <img
        className="failed-img"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
      />
      <h1 className="err-heading">Product Not Found</h1>
      <button className="err-btn" onClick={this.redirectToShop}>
        Continue Shopping
      </button>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case prodConstants.success:
        return this.renderProduct()
      case prodConstants.failure:
        return this.renderFailureView()
      case prodConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}
export default ProductItemDetails
