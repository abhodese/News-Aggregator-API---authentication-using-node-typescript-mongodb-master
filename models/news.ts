import mongoose , {Document, Schema} from 'mongoose';

interface UserPreferences extends Document {
    userId: string;
    preferredNewsSources: string[];
    preferredNewsCategories: string[];
    preferredNewsKeywords: string[];
    preferredNewsLocation: string;
    preferredNewsLanguage: string;
    preferredNewsCountry: string;
    preferredNewsPageSize: number;
    preferredNewsPageNumber: number;
    preferredNewsSortBy: string;
    

  }
  
  interface NewsArticle extends Document {

    newsArticleId: string;
    title: string;
    url: string;
    source: string;
    summary: string;
    imageUrl: string;
    date: Date;


  }
  
  interface ReadNewsArticle {
    userId: string;
    newsArticleId: string;
  }
  
  interface FavoriteNewsArticle {
    userId: string;
    newsArticleId: string;
  }
  
  // Define the user preferences schema
  const userPreferencesSchema = new Schema<UserPreferences>({
    userId: { type: String, required: true },
    preferredNewsSources: { type: [String], required: true },
    preferredNewsCategories: { type: [String], required: true },
    preferredNewsKeywords: { type: [String], required: true },
    preferredNewsLocation: { type: String, required: true },
    preferredNewsLanguage: { type: String, required: true },
    preferredNewsCountry: { type: String, required: true },
    preferredNewsPageSize: { type: Number, required: true },
    preferredNewsPageNumber: { type: Number, required: true },
    preferredNewsSortBy: { type: String, required: true },

  });
  
  
  const newsArticleSchema = new Schema<NewsArticle>({
    newsArticleId: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    source: { type: String, required: true },
    summary: { type: String, required: true },
    imageUrl: { type: String, required: true },
    date: { type: Date, required: true },

  });
  
  const readNewsArticleSchema = new Schema<ReadNewsArticle>({
    userId: { type: String, required: true },
    newsArticleId: { type: String, required: true },
  });
  
  
  const favoriteNewsArticleSchema = new Schema<FavoriteNewsArticle>({
    userId: { type: String, required: true },
    newsArticleId: { type: String, required: true },
  });
  
 
  const UserPreferencesModel = mongoose.model<UserPreferences>('UserPreferences', userPreferencesSchema);
  const NewsArticleModel = mongoose.model<NewsArticle>('NewsArticle', newsArticleSchema);
  const ReadNewsArticleModel = mongoose.model<ReadNewsArticle>('ReadNewsArticle', readNewsArticleSchema);
  const FavoriteNewsArticleModel = mongoose.model<FavoriteNewsArticle>('FavoriteNewsArticle', favoriteNewsArticleSchema);
  

    export {
        UserPreferencesModel,
        NewsArticleModel,
        ReadNewsArticleModel,
        FavoriteNewsArticleModel,
    };















