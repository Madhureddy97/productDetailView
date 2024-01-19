// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getFormattedData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    description: data.description,
    title: data.title,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
  })

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedProductData = this.getFormattedData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachProductDetail => this.getFormattedData(eachProductDetail),
      )

      this.setState({
        productData: updatedProductData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
      />
      <p className="failure-description">Product Not Found</p>
      <Link to="/products">
        <button className="continue-shopping-button">Continue Shopping</button>
      </Link>
    </div>
  )

  onClickMinusButton = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onClickPlusButton = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderSuccessView = () => {
    const {productData, quantity} = this.state
    const {
      id,
      imageUrl,
      title,
      brand,
      totalReviews,
      rating,
      availability,
      price,
      description,
    } = productData

    return (
      <div>
        <div className="image-container">
          <img src={imageUrl} alt="product" />
        </div>
        <div className="text-container">
          <h1>{title}</h1>
          <p>Rs {price}/-</p>
          <div>
            <div>
              <p>{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
              />
            </div>
            <p>{totalReviews} Reviews</p>
          </div>
          <p>{description}</p>
          <p>Available: {availability}</p>
          <p>Brand: {brand}</p>
          <hr />
          <div>
            <button data-testid="minus" onClick={this.onClickMinusButton}>
              <BsDashSquare />
            </button>
            <p>{quantity}</p>
            <button data-testid="plus" onClick={this.onClickPlusButton}>
              <BsPlusSquare />
            </button>
          </div>
          <button>ADD TO CART</button>
        </div>
      </div>
    )
  }

  renderApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    const {productData, similarProductsData} = this.props
    console.log(productData)
    return (
      <div>
        <Header />
        {this.renderApiStatus()}
        <h1>Similar Products</h1>
        <ul>
          {similarProductsData.map(SimilarProduct => (
            <SimilarProductItem
              SimilarProduct={SimilarProduct}
              key={SimilarProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }
}

export default ProductItemDetails
