from elasticsearch import Elasticsearch

# Connect to Elasticsearch
es = Elasticsearch("http://localhost:9200")

INDEX_NAME="dataset"

# Define the index settings and mappings
index_dataset_settings = {
    "settings": {
        "analysis": {
            "analyzer": {
                "custom_analyzer": {
                    "type": "custom",
                    "tokenizer": "standard",
                    "filter": ["lowercase", "stop"]
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "query_task": {
                "type": "keyword",
                "ignore_above": 100  # Restrict field to 100 characters
            },
            "uuid": {
                "type": "keyword",
                "ignore_above": 100  # Restrict field to 100 characters
            },
            "datetime": {
                "type": "date",
                "format": "yyyy-MM-dd HH:mm:ss"
            },
            "content": {
                "type": "text",
                "analyzer": "custom_analyzer",
                "index_options": "positions"  # Optimize for phrase queries
            },
            "requester": {
                "type": "keyword",
                "ignore_above": 100  # Restrict field to 100 characters
            },
        }
    }
}

# Create the index with the defined settings and mappings
if not es.indices.exists(index=INDEX_NAME):
    response = es.indices.create(index=INDEX_NAME, body=index_dataset_settings)
    print("Index created:", response)
else:
    print("Index dataset already exists!")
    exit()


######## Set up query task handling
docs = [
    {
      "query_task": "bbg_bond",
      "uuid": "fd715187-3750-4250-8556-484d02023bb0",
      "content": ":EN MOTORS FIN GM 2 34 05/15/16 101.100/101.100 (1.128/1.128TRAC GM 2 34 05/15/16 Corp Page 1/11 Description: Bond 94 Notes 95) Buy 96) Sell 97) Settings 21) Bond Description 22 Issuer Description Pages Issuer Information Identifiers 1) Bond Info Name GENERAL MOTORS FINL CO ID Number EK0024290 2) Addtl Info Industry Automobiles Manufacturing CUSIP 37045XAG1 3) Covenants Security Information ISIN US37045XAG16 4 Guarantors 5) Bond Ratings Mkt Iss Global Bond Ratings 6) Identifiers Country US Currency USD Moody's Ba1 1) Exchanges Rank Sr Unsecured Series S&P BBB- 8) Inv Parties Coupon  2.75 Type Fixed Fitch BBB- 9) Fees, Restrict Cpn Freq S/A DBRS BBBL 10) Schedules 11) Coupons Day Cnt 30/360 Iss Price Issuance & Trading Quick Links Maturity 05/15/2016 Amt Issued/Outstanding 32) ALLQ Pricing MAKE WHOLE @50 until 05/15/16/BULLE1 USD 999,646.00 (M) 33 QRD Quote Recap Iss Sprd USD 999,646.00 (M) 34 TDH Trade Hist Calc Type (1)STREET CONVENTION Min Piece/Increment 35 cAcs Corp Action Announcement Date 12/23/2013 Prospectus 2,000.00 / 1,000.00 Interest Accrual Date 11/15/2013 37] CN  Sec News Par Amount 1,000.00 38] HDS Holders 1st Settle Date 01/31/2014 Book Runner 39) VPRDUnderly Info 1st Coupon Date 05/15/2014 Reporting TRACE CALL@ MAKE-WHOLE +50 BPS UNTIL 5/15/16. ISS'D IN EXCH OF 144A/REGS SEC; SEE CUSIP () Send Bond 37045XAF3/ISIN USU37047AC89",
      "datetime": "2024-11-12 14:22:45",
      "requester": ""
    },
    {
    "query_task": "bbg_bond",
      "uuid": "fd715187-3750-4250-8446-484d02023bb0",
      "content": ":EN MOTORS FIN GM 2 34 05/15/16 101.100/101.100 (1.128/1.128TRAC GM 2 34 05/15/16 Corp Page 1/11 Description: Bond 94 Notes 95) Buy 96) Sell 97) Settings 21) Bond Description 22 Issuer Description Pages Issuer Information Identifiers 1) Bond Info Name GENERAL MOTORS FINL CO ID Number EK0024290 2) Addtl Info Industry Automobiles Manufacturing CUSIP 37045XAG1 3) Covenants Security Information ISIN US37045XAG16 4 Guarantors 5) Bond Ratings Mkt Iss Global Bond Ratings 6) Identifiers Country US Currency USD Moody's Ba1 1) Exchanges Rank Sr Unsecured Series S&P BBB- 8) Inv Parties Coupon  2.75 Type Fixed Fitch BBB- 9) Fees, Restrict Cpn Freq S/A DBRS BBBL 10) Schedules 11) Coupons Day Cnt 30/360 Iss Price Issuance & Trading Quick Links Maturity 05/15/2016 Amt Issued/Outstanding 32) ALLQ Pricing MAKE WHOLE @50 until 05/15/16/BULLE1 USD 999,646.00 (M) 33 QRD Quote Recap Iss Sprd USD 999,646.00 (M) 34 TDH Trade Hist Calc Type (1)STREET CONVENTION Min Piece/Increment 35 cAcs Corp Action Announcement Date 12/23/2013 Prospectus 2,000.00 / 1,000.00 Interest Accrual Date 11/15/2013 37] CN  Sec News Par Amount 1,000.00 38] HDS Holders 1st Settle Date 01/31/2014 Book Runner 39) VPRDUnderly Info 1st Coupon Date 05/15/2014 Reporting TRACE CALL@ MAKE-WHOLE +50 BPS UNTIL 5/15/16. ISS'D IN EXCH OF 144A/REGS SEC; SEE CUSIP () Send Bond 37045XAF3/ISIN USU37047AC89",
      "datetime": "2024-11-12 16:22:45",
      "requester": ""
    },
    {
    "query_task": "bbg_bond",
      "uuid": "49e06a2b-d3ad-453d-8fff-a9ffb7fe572b",
      "content": " :EN MOTORS FIN GM 2 34 05/15/16 101.100/101.100 (1.128/1.128TRAC GM 2 34 05/15/16 Corp Page 1/11 Description: Bond 94 Notes 95) Buy 96) Sell 97) Settings 21) Bond Description 22 Issuer Description Pages Issuer Information Identifiers 1) Bond Info Name GENERAL MOTORS FINL CO ID Number EK0024290 2) Addtl Info Industry Automobiles Manufacturing CUSIP 37045XAG1 3) Covenants Security Information ISIN US37045XAG16 4 Guarantors 5) Bond Ratings Mkt Iss Global Bond Ratings 6) Identifiers Country US Currency USD Moody's Ba1 1) Exchanges Rank Sr Unsecured Series S&P BBB- 8) Inv Parties Coupon  2.75 Type Fixed Fitch BBB- 9) Fees, Restrict Cpn Freq S/A DBRS BBBL 10) Schedules 11) Coupons Day Cnt 30/360 Iss Price Issuance & Trading Quick Links Maturity 05/15/2016 Amt Issued/Outstanding 32) ALLQ Pricing MAKE WHOLE @50 until 05/15/16/BULLE1 USD 999,646.00 (M) 33 QRD Quote Recap Iss Sprd USD 999,646.00 (M) 34 TDH Trade Hist Calc Type (1)STREET CONVENTION Min Piece/Increment 35 cAcs Corp Action Announcement Date 12/23/2013 Prospectus 2,000.00 / 1,000.00 Interest Accrual Date 11/15/2013 37] CN  Sec News Par Amount 1,000.00 38] HDS Holders 1st Settle Date 01/31/2014 Book Runner 39) VPRDUnderly Info 1st Coupon Date 05/15/2014 Reporting TRACE CALL@ MAKE-WHOLE +50 BPS UNTIL 5/15/16. ISS'D IN EXCH OF 144A/REGS SEC; SEE CUSIP () Send Bond 37045XAF3/ISIN USU37047AC89",
      "datetime": "2024-11-18 19:20:54",
      "requester": ""
    },
    {
    "query_task": "bbg_mbs",
      "uuid": "fd715187-3760-4250-8556-484d02023bb1",
      "content": " FN MA3932 Mtge Actions Export Settings Yield Table 100%FNCI3.5M 4.05414530CUSIP31418DLNO Pool Level As of06/2022 6/2022 537P 32.2C 7.2B Traits CI,30/360Coupon 3.5%Maturity 2/1/35TX 17%2020 2% 3Mo 499 28.9 4.8 01/01/2020 299,161,706LTV/HLTV 69/52Accrual 7/1-7/31CA 17%2019 98% 487 26.8 3.8 06/25/2022 91.342.523MAXLS 711,000 Next Pay 8/25/22 FL 8% 12M0 664 32.5 2.9 Factor 0.30532826WAOLS 302,718 IL 4% Life 109735.2 # Loans 423 1Price-to-Yield Settle 07/18/22 +300MED +200 MED +100 MED OMED 100MED -200MED -300MED Vary 135PSA 143PSA 154PSA 174PSA 205PSA 261PSA 347PSA Price 99-22 3.5447 3.5450 3.5455 3.5463 3.5477 3.5502 3.5545 Avg Life 4.76 4.67 4.56 4.36 4.08 3.62 3.05 Mod Duration 4.16 4.09 3.99 3.83 3.60 3.23 2.75 Prin Win 8/22-7/34 8/22-7/34 8/22-7/34 8/22-7/34 8/22-7/34 8/22-7/34 8/22-7/34 I Spread 52 51 51 50 48 45 42 Jun22May Apr Mar Feb Jan Dec Nov Oct Sep Aug Jul GOVT(I) 6M 1Y 2Y 3Y 5Y 7Y 10Y 30Y 537P301 640 523 425 467 612 878 967 809 840 1196 2.87 3.103.133.143.013.00 2.91 3.08 32.2C17.535.828.2 22.1 234 29.4 40.4 42.5 34.0 33.6 45.4 Disc 30/360 07/13/22",
      "datetime": "2024-11-12 14:22:45",
      "requester": ""
    },
    {
    "query_task": "bbg_mbs",
      "uuid": "fd715117-3750-4653-8446-484d02023bb0",
      "content": " FN MA3932 Mtge Actions Export Settings Yield Table 100%FNCI3.5M 4.05414530CUSIP31418DLNO Pool Level As of06/2022 6/2022 537P 32.2C 7.2B Traits CI,30/360Coupon 3.5%Maturity 2/1/35TX 17%2020 2% 3Mo 499 28.9 4.8 01/01/2020 299,161,706LTV/HLTV 69/52Accrual 7/1-7/31CA 17%2019 98% 487 26.8 3.8 06/25/2022 91.342.523MAXLS 711,000 Next Pay 8/25/22 FL 8% 12M0 664 32.5 2.9 Factor 0.30532826WAOLS 302,718 IL 4% Life 109735.2 # Loans 423 1Price-to-Yield Settle 07/18/22 +300MED +200 MED +100 MED OMED 100MED -200MED -300MED Vary 135PSA 143PSA 154PSA 174PSA 205PSA 261PSA 347PSA Price 99-22 3.5447 3.5450 3.5455 3.5463 3.5477 3.5502 3.5545 Avg Life 4.76 4.67 4.56 4.36 4.08 3.62 3.05 Mod Duration 4.16 4.09 3.99 3.83 3.60 3.23 2.75 Prin Win 8/22-7/34 8/22-7/34 8/22-7/34 8/22-7/34 8/22-7/34 8/22-7/34 8/22-7/34 I Spread 52 51 51 50 48 45 42 Jun22May Apr Mar Feb Jan Dec Nov Oct Sep Aug Jul GOVT(I) 6M 1Y 2Y 3Y 5Y 7Y 10Y 30Y 537P301 640 523 425 467 612 878 967 809 840 1196 2.87 3.103.133.143.013.00 2.91 3.08 32.2C17.535.828.2 22.1 234 29.4 40.4 42.5 34.0 33.6 45.4 Disc 30/360 07/13/22",
      "datetime": "2024-11-12 14:28:45",
      "requester": ""
    },
    {
    "query_task": "bbg_mbs",
      "uuid": "ac978a20-5b89-4b49-82c1-68e23e390e08",
      "content": " FN MA3932 Mtge Actions ExportSettings Yield Table 100%FNCI3.5M 4.05414530CUSIP31418DLNO Pool Level As of06/2022 6/2022 537P 32.2C 7.2B Traits CI,30/360Coupon 3.5%Maturity 2/1/35TX 17%2020 2% 3Mo 499 28.9 4.8 01/01/2020 299,161,706LTV/HLTV 69/52Accrual 7/1-7/31CA 17%2019 98% 487 26.8 3.8 06/25/2022 91.342.523MAXLS 711,000 Next Pay 8/25/22 FL 8% 12M0 664 32.5 2.9 Factor 0.30532826WAOLS 302,718 IL 4% Life 109735.2 # Loans 423 1Price-to-Yield Settle 07/18/22 +300MED +200 MED +100 MED OMED 100MED -200MED -300MED Vary 135PSA 143PSA 154PSA 174PSA 205PSA 261PSA 347PSA Price 99-22 3.5447 3.5450 3.5455 3.5463 3.5477 3.5502 3.5545 Avg Life 4.76 4.67 4.56 4.36 4.08 3.62 3.05 Mod Duration 4.16 4.09 3.99 3.83 3.60 3.23 2.75 Prin Win 8/22-7/34 8/22-7/34 8/22-7/34 8/22-7/34 8/22-7/34 8/22-7/34 8/22-7/34 I Spread 52 51 51 50 48 45 42 Jun22May Apr Mar Feb Jan Dec Nov Oct Sep Aug Jul GOVT(I) 6M 1Y 2Y 3Y 5Y 7Y 10Y 30Y 537P301 640 523 425 467 612 878 967 809 840 1196 2.87 3.103.133.143.013.00 2.91 3.08 32.2C17.535.828.2 22.1 234 29.4 40.4 42.5 34.0 33.6 45.4 Disc 30/360 07/13/22",
      "datetime": "2024-11-24 19:33:48",
      "requester": ""
    },
    {
    "query_task": "cfest_bond",
      "uuid": "0ab69cdf-e6a9-4fdf-9459-e24bf00db02a",
      "content": " CN CPTY062 C612 MCNI Security Master Enquiry 28OCT24 0:00 JYFGCNQV Description EFGBND-03.78-260625 Sec Master No MCS243020009 Currency/Product CNY /FQB CPTY ID. Issuer/Maturity 25JUN2019/26JUN2025 Periodicity A Interest Method Coupon Rate 3.78000000 Actual Start 25JUN2019 Even Coupon Re-invest Coupon N Pre-Tax Cpn Rate 3.78000000 Status (A/D/O Y Compound Accural N Price Capture (A/M Normal Settlement 1 days Revaluation Date Auto Fixing RFR Type Compound/Simple Lookback O0 Obs Shift Lockout 00 Revaluation Method (P-Price, B-Benchmark bond, C-Bond yield curve, D-Dsc mrgin) Rate Precision Benchmark Securities Security ID % Type Code % CGAPBJG 147770 Collat Schedule ISIN CND10000170Y2 Bond Yield Curve B Discount Factor Curve Curve/Swap Periodicity Basis F1-Exit F2-Prev Screen ENTER-Coupon Schedule F8-Unit Price",
      "datetime": "2024-11-24 13:56:06",
      "requester": ""
    },
    {
    "query_task": "cfest_bond",
      "uuid": "974b571c-f387-43df-89d5-d8eab50cb583",
      "content": " CN CPTY 062 C612 MCNI Security Master Enquiry 28OCT24 0:00 JYFGCNQV CPTY ID. Description ABCDBND-03.78-200725 Sec Master No. MCS243020007 Currency CNY Product FQB STATE GOV BONDS Price Fraction Basis 128 Issuer ABCD (I) THE PEOPLES GOV OF FUJIAN Issue Dt 19JUL2018 Actual Issue Dt 19JUL2018 Maturity Issue Dt 20JUL2025 2,558 D Coupon Rate 3.78000 Periodicity A Ref Coupon Date 20JUL Interest Method Ex-dividend (Days Before Coupon Date) Even Coupon Re-invest Coupon Accural Start 20JUL2018 Y N Compound Accrual Pre-Tax Cpn Rate 3.78000 Status (A/D/O) A N Yield-Price Cal (C/S) Remarks DOMESTIC GEN LOCAL GOVE BOND Discountability 2018 (09) N Estimated Coupon Rate 147770 N Refer Holiday Subordinated Debt CNY Total Issued 4,750,000,000.00 Normal Face Value Long Limit 4,750,000,000.00 Short Limit 000 Coversion Date Asc Code Next Call Date Next Put Date Call Notice Period Guarantor Put Notice Period Stock Exch ID 00 Resource Underlying F1-Exit F7-Unit Price ENTER-Screen2",
      "datetime": "2024-11-24 14:11:57",
      "requester": ""
    },
    {
    "query_task": "cfest_bond",
      "uuid": "974b571c-f387-43df-89d5-d8eab50cb583",
      "content": " CN CPTY062 C612 MCNI Security Master Enquiry 28OCT24 0:00 JYFG CNQV Description ABCDBND-03.78-200725 Sec Master No MCS243020007 Currency/Product CNY /FQB CPTY ID. Issuer/Maturity 19JUL2018 / 20JUL2025 Periodicity A Interest Method Coupon Rate 3.78000000 Actual Start 20JUL2018 Even Coupon Re-invest Coupon N Pre-Tax Cpn Rate 3.78000000 Status (A/D/O Y Compound Accural N Price Capture (A/M) Normal Settlement 1 days Revaluation Date Auto Fixing RFR Type Compound/Simple Lookback O0 Obs Shift Lockout 00 Revaluation Method (P-Price, B-Benchmark bond,C-Bond yield curve,D-Dsc mrgin) Rate Precision Benchmark Securities Security ID % Type Code % CGAPBJG 147770 Collat Schedule ISIN CND10000170Y2 Bond Yield Curve B Discount Factor Curve Curve/Swap Periodicity Basis F1-Exit F2-Prev Screen ENTER-Coupon Schedule F8-Unit Price",
      "datetime": "2024-11-24 14:12:08",
      "requester": ""
    },
    {
    "query_task": "cfest_bond",
      "uuid": "974b571c-f387-43df-89d5-d8eab50cb583",
      "content": " CN CPTY 062 C612 MCNI Security Master Enquiry 28OCT24 0:00 JYFGCNQV CPTY ID. Description EFGBND-03.78-260625 Sec Master No. MCS243020009 Currency CNY Product BJC STATE GOV BONDS Price Fraction Basis 128 Issuer EFG (I) THE PEOPLES GOV OF BEIJING Issue Dt 25JUN2019 Actual Issue Dt 25JUN2019 Maturity Issue Dt 26JUN2025 Coupon Rate 3.78000 Periodicity A Ref Coupon Date 25JUN Ex-dividend Days Before Coupon Date Interest Method 0 Even Coupon Re-invest Coupon Accural Start 25JUN2019 Compound Accrual N Pre-Tax Cpn Rate 3.78000 Status (A/D/O) A N Yield-Price Cal (C/S) Remarks DOMESTIC GEN LOCAL GOVE BOND Discountability 2019 (09) N Estimated Coupon Rate 147770 N Refer Holiday Subordinated Debt CNY Total Issued 4,000,000,000.00 Normal Face Value Long Limit 4.000.000.000.00 Short Limit 000 Coversion Date Asc Code Next Call Date Next Put Date Call Notice Period Guarantor Put Notice Period Stock Exch ID 00 Resource Underlying F1-Exit F7-Unit Price ENTER-Screen 2",
      "datetime": "2024-11-24 14:12:21",
      "requester": ""
    },
    {
    "query_task": "cfest_bond",
      "uuid": "974b571c-f387-43df-89d5-d8eab50cb583",
      "content": " CN CPTY062 C612 MCNI Security Master Enquiry 28OCT24 0:00 JYFGCNQV Description EFGBND-03.78-260625 Sec Master No MCS243020009 Currency/Product CNY /FQB CPTY ID. Issuer/Maturity 25JUN2019/26JUN2025 Periodicity A Interest Method Coupon Rate 3.78000000 Actual Start 25JUN2019 Even Coupon Re-invest Coupon N Pre-Tax Cpn Rate 3.78000000 Status (A/D/O Y Compound Accural N Price Capture (A/M Normal Settlement 1 days Revaluation Date Auto Fixing RFR Type Compound/Simple Lookback O0 Obs Shift Lockout 00 Revaluation Method (P-Price, B-Benchmark bond, C-Bond yield curve, D-Dsc mrgin) Rate Precision Benchmark Securities Security ID % Type Code % CGAPBJG 147770 Collat Schedule ISIN CND10000170Y2 Bond Yield Curve B Discount Factor Curve Curve/Swap Periodicity Basis F1-Exit F2-Prev Screen ENTER-Coupon Schedule F8-Unit Price",
      "datetime": "2024-11-24 14:12:31",
      "requester": ""
    },
    {
    "query_task": "cfest_bond",
      "uuid": "c8269283-b221-455d-b5f7-a8e302e4400f",
      "content": " CN CPTY062 C612 MCNI Security Master Enquiry 28OCT24 0:00 JYFGCNQV Description EFGBND-03.78-260625 Sec Master No MCS243020009 Currency/Product CNY /FQB CPTY ID. Issuer/Maturity 25JUN2019/26JUN2025 Periodicity A Interest Method Coupon Rate 3.78000000 Actual Start 25JUN2019 Even Coupon Re-invest Coupon N Pre-Tax Cpn Rate 3.78000000 Status (A/D/O Y Compound Accural N Price Capture (A/M Normal Settlement 1 days Revaluation Date Auto Fixing RFR Type Compound/Simple Lookback O0 Obs Shift Lockout 00 Revaluation Method (P-Price, B-Benchmark bond, C-Bond yield curve, D-Dsc mrgin) Rate Precision Benchmark Securities Security ID % Type Code % CGAPBJG 147770 Collat Schedule ISIN CND10000170Y2 Bond Yield Curve B Discount Factor Curve Curve/Swap Periodicity Basis F1-Exit F2-Prev Screen ENTER-Coupon Schedule F8-Unit Price",
      "datetime": "2024-11-24 21:56:15",
      "requester": ""
    }
]



for doc in docs:
    response = es.index(index=INDEX_NAME, document=doc)
    print("Document indexed:", response)

