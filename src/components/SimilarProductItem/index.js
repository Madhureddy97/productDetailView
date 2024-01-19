// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {SimilarProduct} = props
  const {imageUrl, title, style, price, rating} = SimilarProduct

  return (
    <li>
      <img src={imageUrl} alt={`product ${title}`}/>
      <h1>{title}</h1>
      <p>{style}</p>
      <div>
        <p>Rs {price}/-</p>
        <div>
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
