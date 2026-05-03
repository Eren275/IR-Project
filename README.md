# IR-Project
# Travel Cost Estimator

A full web intelligence project that collects, processes, and analyzes travel data to estimate trip costs using real-world flight prices.

---

## Project Overview

The Travel Cost Estimator is a data-driven system that simulates a real-world travel intelligence pipeline.
It scrapes flight price data from the web, processes it, and generates insights to help users estimate travel costs.

---

## Objectives

* Collect real-world travel data using web scraping
* Clean and preprocess noisy data
* Perform cost estimation and budget classification
* Analyze and compare travel destinations
* Provide insights for decision-making

---

## Data Collection (Scraping & Crawling)

* Tool: Selenium
* Multi-route scraping (e.g., CAI → DXB, HRG, LXR)
* Multi-date crawling
* Dynamic content handling

```python
for origin, dest in routes:
    for date in dates:
        driver.get(url)
```

---

## Data Extraction

* Extract prices containing currency symbols ($, £)
* Convert text to numeric values

---

## Data Cleaning

* Remove duplicates
* Filter invalid prices (≤ 0)

```python
df = df.drop_duplicates()
df = df[df["price"] > 0]
```

---

## Feature Engineering

The system generates meaningful features:

* Tax = 15% of price
* Total Cost = price + tax
* Budget Level:

  * Low (< 200)
  * Medium (< 500)
  * High (≥ 500)

```python
df["tax"] = df["price"] * 0.15
df["total_cost"] = df["price"] + df["tax"]
```

---

## AI-like Feature

* Affordability Score:

```python
df["affordability_score"] = 1000 / df["total_cost"]
```

This helps rank trips based on cost efficiency.

---

## Exploratory Data Analysis (EDA)

* Statistical summary (describe)
* Average price per destination
* Identify cheapest and most expensive destinations

---

## Visualization

* Bar chart comparing average prices across destinations

```python
df.groupby("destination")["price"].mean().plot(kind="bar")
```

---

## Ethical Scraping (robots.txt)

* The system checks robots.txt before scraping:

```python
requests.get("https://booking.kayak.com/robots.txt")
```

---

## Data Storage

* Excel file (.xlsx)
* JSON file (.json)

```python
df.to_excel("travel_dataset.xlsx")
df.to_json("travel_dataset.json")
```

---

## Data Pipeline

Data Collection → Cleaning → Feature Engineering → Analysis → Visualization → Storage

---

## Dataset

* Size: 50–200 records
* Structured format
* Real-world scraped data

---

## Technologies Used

* Python
* Selenium
* Pandas
* Matplotlib
* Requests

---

## Results

* Generated structured dataset of travel prices
* Identified cost patterns across destinations
* Built a basic decision-support system for travel budgeting

---

## Conclusion

This project demonstrates a complete end-to-end data pipeline, similar to real-world systems used in travel platforms, recommendation systems, and cost analysis tools.

---

## Author

Mohammed Ramadan

Omar mohamed

Youssef tarek

Ibrahim hafez

---

##
