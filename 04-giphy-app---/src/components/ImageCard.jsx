export const ImageCard = (url, tittle) => {
  return (
    <div className='image-container'>
      <img scr={url} alt={tittle} className='image-view' />
    </div>
  )
}
/** rafce */
export default ImageCard
