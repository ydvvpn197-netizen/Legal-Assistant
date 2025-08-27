# Security Overview (MVP)

- Transport: Use HTTPS in production; dev uses localhost.
- Data: Credentials are hashed. Session JWT stored in HTTP-only cookie.
- Least privilege: Only required services and ports are exposed.
- Reporting: Please open a security issue with reproduction details.
