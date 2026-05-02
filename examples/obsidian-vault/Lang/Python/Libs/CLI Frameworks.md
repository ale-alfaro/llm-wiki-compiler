---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
| Feature | Typer | Click | Argparse |  |
| --- | --- | --- | --- | --- |
| Type Hint Support | ✓ | ✘ | ✘ |  |
|  |  |  |  |  |
| Auto Help Generation | ✓ | ✓ | ✘ |  |
|  |  |  |  |  |
| Async Support | ✓ | ✘ | ✘ |  |
|  |  |  |  |  |
| Learning Curve | Easy | Moderate | Steep |  |

![comparison-table](https://media.licdn.com/dms/image/v2/D4D12AQEwIv0bcUTEcA/article-inline_image-shrink_1000_1488/article-inline_image-shrink_1000_1488/0/1732891842211?e=2147483647&v=beta&t=BRzsjHEbXCmfe9a1mo_iI_VzCPYZTkC46dRrplaTm-I)

More: [[Navigating the CLI Landscape in Python A Comparative Study of argparse, click,
and typer]]

### Example

![[cli-app-typer.py]]
```python

def greet(name: str, age: int = typer.Option(0, help="Your age")):
    typer.echo(f"Hello {name}, you are {age} years old!")


async def download(url: str):
    await asyncio.sleep(2)
    typer.echo(f"Downloaded {url}")
typer.run(download)


app = typer.Typer()
users_app = typer.Typer()

@users_app.command()
def create(name: str):
    typer.echo(f"User {name} created!")

@users_app.command()
def delete(name: str):
    typer.echo(f"User {name} deleted!")

app.add_typer(users_app, name="users")
if __name__ == "__main__":
    app()
```
