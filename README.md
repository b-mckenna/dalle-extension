This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

1. Install `pnpm`:

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

2. Install the JS dependencies:

```bash
pnpm install
```

!!! tip
    You may want to check your node and npm version by using "node -v" and "npm -v" respectively. The app was developed using node v16.16.0

!!! note
    If you are facing ENOENT errors with node-gyp, try cleaning out node modules and cache before trying again:

    ```sh
    rm -rf node_modules && npm cache clean --force && npm install
    ```

3. Install the Python dependencies.

```bash
python3 -m virtualenv venv
source venv/bin/activate
python3 -m pip install -r requirements.txt
```

4. Create a `.env` file at the root of the repository. This should contain a `SENDGRID_API_KEY`.

5. Run the development server for the extension:

```bash
pnpm dev
```

6. In a separate terminal, run the Python server (defaults to port 8000):

```bash
uvicorn server:app --reload
```

7. On your browser, go to `chrome://extensions`, enable "Developer Mode", and then press "Load Unpacked". Navigate to `build/chrome-mv3-dev` to finish loading the extension.

8. Finally, navigate to https://labs.openai.com to see the extension.

!!! note
    Make sure you are logged in on OpenAI to see the extension
