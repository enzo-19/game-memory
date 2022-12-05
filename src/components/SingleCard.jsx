const SingleCard = ({card,handleChoice, flipped}) => {
  return (
    <div className={`single-card ${flipped ? 'flipped' : ''}`} onClick={() => handleChoice(card)}>
        <img src={card.src} alt="card front" className='front' />
        <img src='/img/back.jpg' alt="card back" className='back' />
    </div>
  )
}

export default SingleCard