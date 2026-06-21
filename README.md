# Portfolio

> Chris S&aacute;

This repo owns the portfolio application code: the main site, admin UI, shared gallery manifest types, and portfolio Lambda handlers.

Infrastructure is owned by the separate `aws_infra` Terraform repo. Do not add IAM policies, API Gateway route definitions, CloudFront Function source, or Lambda creation/deletion scripts here. Project workflows may build and publish code artifacts, but Terraform is the source of truth for creating, updating, and deleting AWS infrastructure.
