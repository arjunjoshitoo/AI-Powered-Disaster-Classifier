# train_model.py

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import pickle

# Load Kaggle dataset
df = pd.read_csv('data/train.csv')
df = df[['text', 'target']].dropna()

# Check balance
print("Class distribution:\n", df['target'].value_counts())

# Split data
X_train, X_test, y_train, y_test = train_test_split(df['text'], df['target'], test_size=0.2, random_state=42)

# Vectorize text (TF-IDF)
vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
X_train_vec = vectorizer.fit_transform(X_train)

# Train classifier
model = LogisticRegression()
model.fit(X_train_vec, y_train)

# Save model and vectorizer
with open('sos_model.pkl', 'wb') as f:
    pickle.dump(model, f)

with open('vectorizer.pkl', 'wb') as f:
    pickle.dump(vectorizer, f)

print("✅ Model trained and saved!")