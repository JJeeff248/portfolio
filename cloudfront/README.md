# CloudFront Function: og-injector

Injects per-page Open Graph and Twitter Card meta tags into `index.html` responses at the CDN edge, before they reach the browser (or a social media crawler).

## How it works

1. CloudFront serves `index.html` for every SPA route (via S3 custom error page: 403/404 → `/index.html`).
2. This function runs as a **viewer-response** handler — after S3 returns the HTML but before it reaches the client.
3. It reads the request URI and query string (`?photo=N`), selects the correct OG metadata, and rewrites the `<!-- Open Graph / Social Previews -->` block in the HTML body.

Crawlers (Slack, Discord, iMessage, Twitter, LinkedIn) see the correct per-page preview image and title.

## Pages covered

| URL | Preview |
|-----|---------|
| `/` | Portfolio overview |
| `/gallery` | Photography gallery with default photo |
| `/gallery?photo=0..18` | That specific photo from `static.chris-sa.com` |
| `/projects/twentythreefiftynine` | Twenty Three Fifty Nine project |
| `/projects/teach-python` | Teach Python project |
| `/projects/helpamate` | Help a Mate project |
| `/projects/chapschallenge` | Chap's Challenge project |

## Deploy

Deployment is handled automatically by the GitHub Actions workflow (`.github/workflows/deploy.yml`) on every push to `main`. The workflow:

1. Creates the function if it doesn't exist, or updates the code if it does
2. Publishes the function (makes it live)
3. Associates it with the CloudFront distribution's default behavior if not already linked

**One-time manual step required:** Enable **"Include body"** on the viewer-response function association in the AWS Console. This cannot be set via the standard `update-distribution` API — it requires the console or a separate API call.

- Go to **CloudFront → Distributions → your distribution**
- Open the **Behaviors** tab → edit the **Default (*)** behavior
- Under **Function associations → Viewer response**, confirm `og-injector` is listed
- Tick **"Include body"** and save

Without this, the function runs but cannot read or modify the HTML response body.

### IAM permissions required

Add these actions to the `GithubActionPortfolioDeploy` role policy:

```json
{
  "Effect": "Allow",
  "Action": [
    "cloudfront:DescribeFunction",
    "cloudfront:CreateFunction",
    "cloudfront:UpdateFunction",
    "cloudfront:PublishFunction",
    "cloudfront:GetDistributionConfig",
    "cloudfront:UpdateDistribution"
  ],
  "Resource": "*"
}
```

`GetDistributionConfig` and `UpdateDistribution` are already used implicitly by the invalidation step, but need to be explicit for the association logic.

### Test after first deploy

Use the [OpenGraph.xyz debugger](https://www.opengraph.xyz/) or the [Twitter Card Validator](https://cards-dev.twitter.com/validator) against:
- `https://chris-sa.com/`
- `https://chris-sa.com/gallery`
- `https://chris-sa.com/gallery?photo=0`
- `https://chris-sa.com/projects/twentythreefiftynine`
