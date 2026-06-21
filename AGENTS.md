# Repository Guidance

This repository owns portfolio project code only:

- Main portfolio site code under `main/`.
- Portfolio admin UI under `admin/`.
- Portfolio Lambda handler code under `lambdas/`.
- Shared application types and helpers under `packages/`.

AWS infrastructure is managed in the separate `aws_infra` Terraform repository. Do not add IAM policies, API Gateway route definitions, CloudFront Function source, bucket/table definitions, Lambda creation/deletion scripts, or other infrastructure ownership here.

GitHub Actions in this repo may build and publish code artifacts, static site assets, and Lambda packages. They should not create, mutate, or delete AWS infrastructure resources directly.

Use the root workspace lockfile (`package-lock.json`) as the dependency source of truth. Do not add nested npm lockfiles for workspaces.
