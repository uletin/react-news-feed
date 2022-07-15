import React, { useState, useEffect } from "react";

/** 
{
    news
    page
    isLoading
    isError
    isRefresh
}
*/

const defaultNews = {
    status: "ok",
    totalResults: 0,
    articles: []
}

const endpoint = "https://newsapi.org/v2/top-headlines?country=us&apiKey=a8d03bc7e7494286b2382cd58b371335"

function NewsFeed() {

    const [news, setNews] = useState(defaultNews)
    const [page, setPage] = useState(1)
    const [isLoading, setLoading] = useState(false)
    const [isError, setError] = useState(false)
    const [isRefresh, setRefresh] = useState(false)

    const handleRefresh = () => {
        setNews(defaultNews)
        setPage(1)
        setLoading(false)
        setRefresh(false)
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${endpoint}&page=${page}`)
                const result = await response.json()
                setNews(current => {
                    return (
                        {
                            ...result,
                            articles: [...current.articles, ...result.articles],
                            totalResult: result.totalResult,
                            status: result.status
                        }
                    )
                })
                if (result.status !== "ok") {
                    throw new Error('error')
                }
            } catch (error) {
                setError(true)
            }
            setLoading(false)
        }
        fetchData()
    }, [page, isRefresh])

    return (
        <div>
            <h3>Top News Headline</h3>
            {isLoading && <p>Loading...</p>}
            {isError && <p>Maaf Ada Gangguan... </p>}
            <ol>
                {news.articles.map((item, index) => (
                    <li key={index}>{item.title}</li>
                ))}
            </ol>
            {
                news.articles.length < parseInt(news.totalResults) ? (
                <button 
                    disabled={isLoading}
                    onClick={() => setPage(c => c + 1)}
                >Load More </button>
                ) : null
            }
            <button onClick={handleRefresh} disabled={isLoading}>Refresh</button>
        </div>
    )
}

export default NewsFeed