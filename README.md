# Router Comparsion - Compare your server response data

Comparing response data from servers when is migrating services.

## Installation:

```
$ npm install -g @somosprte/route-comparison
```

## Flags

`--config` used to specify location of request file(s) to be used in execution of requests

## Configuration

Example `config.yaml`:

```yaml
servers:
  original: https://localhost:3333/v1
  compare: https://localhost:3333/v2

requests:
  /healthcheck:
    url: /healthcheck
    method: GET

  /users:
    urls:
      - /users/new
      - /users/create
    method: POST
    headers:
      Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxfQ.0Y4AEK4_wc8-qtz7ik1VMWc9bOStRWOCH_MNEm38dq0
    data: |
      {
        "email: "viniciusgutierrez@prte.com.br",
        "password": "12345678"
      }
```

## Usage

For multiple files:
```
$ route-comparison --config=requests
```

For specific file:
```
$ route-comparison --config=requests/request.yaml
```
