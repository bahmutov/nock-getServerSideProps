import styles from './index.module.css'

function HomePage({ joke }) {
  return <div className={styles.home}>
    <div className={styles.content}>{joke}</div>
  </div>
}

export async function getServerSideProps(context) {
  console.log('getServerSideProps')

  const url = 'https://icanhazdadjoke.com/'
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  })
  const data = await res.json()
  console.log(data)

  return {
    props: {
      joke: data.joke
    },
  }
}

export default HomePage
