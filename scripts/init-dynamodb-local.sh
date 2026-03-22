#!/bin/sh

set -e

aws dynamodb create-table \
  --table-name messages \
  --attribute-definitions \
    AttributeName=pk,AttributeType=S \
    AttributeName=gsi1pk,AttributeType=S \
    AttributeName=gsi2pk,AttributeType=S \
    AttributeName=createdAt,AttributeType=S \
  --key-schema \
    AttributeName=pk,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes '[
    {
      "IndexName": "gsi1",
      "KeySchema": [
        { "AttributeName": "gsi1pk", "KeyType": "HASH" }
      ],
      "Projection": { "ProjectionType": "ALL" }
    },
    {
      "IndexName": "gsi2",
      "KeySchema": [
        { "AttributeName": "gsi2pk", "KeyType": "HASH" },
        { "AttributeName": "createdAt", "KeyType": "RANGE" }
      ],
      "Projection": { "ProjectionType": "ALL" }
    }
  ]' \
  --endpoint-url http://localhost:8000