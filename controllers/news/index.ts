import e from 'express';
import { NewsArticleModel, UserPreferencesModel, ReadNewsArticleModel, FavoriteNewsArticleModel } from '../../models/news';
import axios from 'axios';



interface Result {

    data: any;
    error: string | null;
}

interface GetPreferencesArgsType {
    userId: string;
}

interface UpdatePreferencesArgsType {
    userId: string;
    preferences: any; // Replace 'any' with the appropriate type for preferences
}

interface FetchNewsArgsType {
    userId: string;
}

interface MarkNewsArticleAsReadArgsType {
    userId: string;
    newsArticleId: string;
}

interface MarkNewsArticleAsFavoriteArgsType {
    userId: string;
    newsArticleId: string;
}

interface GetReadNewsArticlesArgsType {
    userId: string;
}

interface FetchNewsByKeywordsArgsType {
    userId: string;
    keywords: string[];
}



const getPreferences = async (args: GetPreferencesArgsType): Promise<Result> => {
    const { userId } = args;
    const preferences = await UserPreferencesModel.findOne({
        userId,
    });

    return {
        error: null,
        data: preferences,
    };
};

const updatePreferences = async (args: UpdatePreferencesArgsType): Promise<Result> => {
    const { userId, preferences } = args;
    const updatedPreferences = await UserPreferencesModel.findOneAndUpdate(
        {
            userId,
        },
        {
            $set: preferences,
        },
        {
            new: true,
        }
    );

    return {
        error: null,
        data: updatedPreferences,
    };
}

//use axios to fetch news from newsapi.org
const fetchNews = async (args: FetchNewsArgsType): Promise<Result> => {
    const { userId } = args;
    const preferences = await UserPreferencesModel.findOne({
        userId,
    });
    const { preferredNewsCategories, preferredNewsCountry } = preferences;
    const url = `https://newsapi.org/v2/top-headlines?country=${preferredNewsCountry}&category=${preferredNewsCategories}&apiKey=${process.env.NEWS_API_KEY}`;
    const response = await axios.get(url);
    const { articles } = response.data;
    const newsArticles = await Promise.all(
        articles.map(async (article: any) => {
            const { url } = article;
            const existingNewsArticle = await NewsArticleModel.findOne({
                url,
            });
            if (existingNewsArticle) {
                return existingNewsArticle;
            }
            const newsArticle = await NewsArticleModel.create(article);
            return newsArticle;
        })
    );

    return {
        error: null,
        data: newsArticles,
    };
}


const markNewsArticleAsRead = async (args: MarkNewsArticleAsReadArgsType): Promise<Result> => {
    const { userId, newsArticleId } = args;
    const readNewsArticle = await ReadNewsArticleModel.create({
        userId,
        newsArticleId,
    });

    return {
        error: null,
        data: readNewsArticle,
    };
}



const markNewsArticleAsFavorite = async (args: MarkNewsArticleAsFavoriteArgsType): Promise<Result> => {
    const { userId, newsArticleId } = args;
    const favoriteNewsArticle = await FavoriteNewsArticleModel.create({
        userId,
        newsArticleId,
    });

    return {
        error: null,
        data: favoriteNewsArticle,
    };
}




const getReadNewsArticles = async (args: GetReadNewsArticlesArgsType): Promise<Result> => {
    const { userId } = args;
    const readNewsArticles = await ReadNewsArticleModel.find({
        userId,
    });

    return {
        error: null,
        data: readNewsArticles,
    };
}


const getFavoriteNewsArticles = async (args: GetReadNewsArticlesArgsType): Promise<Result> => {
    const { userId } = args;
    const favoriteNewsArticles = await FavoriteNewsArticleModel.find({
        userId,
    });

    return {
        error: null,
        data: favoriteNewsArticles,
    };
}

//get all news articles based on keywords using axios to fetch news from newsapi.org

const fetchNewsByKeywords = async (args: FetchNewsByKeywordsArgsType): Promise<Result> => {
    const { userId, keywords } = args;

    try {
        const preferences = await UserPreferencesModel.findOne({ userId });
        const { preferredNewsCountry, preferredNewsCategories } = preferences;

        const keywordQuery = keywords.join(' OR ');

        const url = `https://newsapi.org/v2/top-headlines?q=${keywordQuery}&country=${preferredNewsCountry}&category=${preferredNewsCategories}&apiKey=${process.env.NEWS_API_KEY}`;

        const response = await axios.get(url);
        const { articles } = response.data;

        const newsArticles = await Promise.all(
            articles.map(async (article: any) => {
                const { url } = article;
                const existingNewsArticle = await NewsArticleModel.findOne({ url });

                if (existingNewsArticle) {
                    return existingNewsArticle;
                }

                const newsArticle = await NewsArticleModel.create(article);
                return newsArticle;
            })
        );

        return {
            error: null,
            data: newsArticles,
        };
    } catch (error) {
        console.error('Error fetching news articles:', error);
        return {
            error: 'Error fetching news articles',
            data: [],
        };
    }
};


export default {
    getPreferences,
    updatePreferences,
    fetchNews,
    markNewsArticleAsRead,
    markNewsArticleAsFavorite,
    getReadNewsArticles,
    getFavoriteNewsArticles,
    fetchNewsByKeywords,
};






