#!/usr/bin/env sh

set -eu

TABLE_NAME="${DYNAMODB_TABLE_NAME:-messages}"
REGION="${AWS_REGION:-us-east-1}"

aws dynamodb create-table \
  --table-name "$TABLE_NAME" \
  --region "$REGION" \
  --attribute-definitions \
    AttributeName=pk,AttributeType=S \
    AttributeName=sk,AttributeType=S \
    AttributeName=gsi1pk,AttributeType=S \
    AttributeName=gsi1sk,AttributeType=S \
    AttributeName=gsi2pk,AttributeType=S \
    AttributeName=gsi2sk,AttributeType=S \
  --key-schema \
    AttributeName=pk,KeyType=HASH \
    AttributeName=sk,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes '[
    {
      "IndexName": "gsi1",
      "KeySchema": [
        { "AttributeName": "gsi1pk", "KeyType": "HASH" },
        { "AttributeName": "gsi1sk", "KeyType": "RANGE" }
      ],
      "Projection": { "ProjectionType": "ALL" }
    },
    {
      "IndexName": "gsi2",
      "KeySchema": [
        { "AttributeName": "gsi2pk", "KeyType": "HASH" },
        { "AttributeName": "gsi2sk", "KeyType": "RANGE" }
      ],
      "Projection": { "ProjectionType": "ALL" }
    }
  ]'
