# Employee Api Spec

## Get Employees

Endpoint : GET /api/employee

Response Body (Success) :

```json
{
  "data": [
    {
      "id": 1,
      "firstName": "Youse",
      "lastName": "Nur",
      "position": "Fullstack Developer",
      "phone": "0821374638192",
      "email": "yosenurf@gmail.com"
    }
  ]
}
```

## Post Employee

Endpoint : POST /api/employee

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "firstName": "Youse",
    "lastName": "Nur",
    "position": "Fullstack Developer",
    "phone": "0821374638192",
    "email": "yosenurf@gmail.com"
  }
}
```

Response Body (Error) :

```json
{
  "error": "Email already exist!"
}
```

## Patch Employee

Endpoint : PATCH /api/employee

Response Body (Success) :

```json
{
  "data": [
    {
      "id": 1,
      "firstName": "Youse",
      "lastName": "Nur",
      "position": "Fullstack Developer",
      "phone": "0821374638192",
      "email": "yosenurf@gmail.com"
    }
  ]
}
```

Response Body (Error) :

```json
{
  "error": "User with id 10 not found!"
}
```
