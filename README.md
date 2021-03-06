# dwork

## Starting

home % git clone https://github.com/dfinity/internet-identity

internet-identity % dfx start --clean --background
internet-identity % II_ENV=development dfx deploy --no-wallet --argument '(null)'
internet-identity % dfx canister call internet_identity init_salt
internet-identity % npm start

dwork % dfx build --check
dwork % II_ENV=development dfx deploy
dwork % npm start

Internet Identity runs on localhost:8080
Dwork runs on localhost:8081

## Description

## Market

With the dwork actor you can create market canisters. Each market can have its own members and concept scheme.

## Bid and Ask

1. The expert creates a bid that offers some services in a given time period.

2. The client queries for a service in a given time period. The system displays the bids that match the query.

3. The client selects the bids (or slices of them) he wants to ask for.

4. The expert accepts or declines the asks posted by the clients.

5. If a query returns no matching bids the client can post an ask. Subsequently the clients can ask for the new bid.

## Stakes

1. Users can stake in their own and other user's profile.

2. In order to bid or ask a user must have staked in total a minimum of 10% of the trade's volume.

## Trades

1. A trade is done when the bidder accepts an ask.

2. When a trade is done 5% of the trade's volume are distributed to the stake holders of the profile (proportionally to their stakes already hold).

3. When a party cancels a trade 10% of the party's stakes are transfered to the global markets stakes.



## etc

Welcome to your new dwork project and to the internet computer development community. By default, creating a new project adds this README and some template files to your project directory. You can edit these template files to customize your project and to include your own code to speed up the development cycle.

To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with dwork, see the following documentation available online:

- [Quick Start](https://sdk.dfinity.org/docs/quickstart/quickstart-intro.html)
- [SDK Developer Tools](https://sdk.dfinity.org/docs/developers-guide/sdk-guide.html)
- [Motoko Programming Language Guide](https://sdk.dfinity.org/docs/language-guide/motoko.html)
- [Motoko Language Quick Reference](https://sdk.dfinity.org/docs/language-guide/language-manual.html)
- [JavaScript API Reference](https://erxue-5aaaa-aaaab-qaagq-cai.raw.ic0.app)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd dwork/
dfx help
dfx config --help
```

## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash
# Starts the replica, running in the background
dfx start --background

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

Once the job completes, your application will be available at `http://localhost:8000?canisterId={asset_canister_id}`.

Additionally, if you are making frontend changes, you can start a development server with

```bash
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 8000.

### Note on frontend environment variables

If you are hosting frontend code somewhere without using DFX, you may need to make one of the following adjustments to ensure your project does not fetch the root key in production:

- set`NODE_ENV` to `production` if you are using Webpack
- use your own preferred method to replace `process.env.NODE_ENV` in the autogenerated declarations
- Write your own `createActor` constructor