import degiro, {DeGiroEnums} from 'degiro-api'

const {PORTFOLIO_POSITIONS_TYPE_ENUM, DeGiroActions, DeGiroTimeTypes, DeGiroMarketOrderTypes} = DeGiroEnums

function OrderConfirmation(
    orderId,
    confirmationId,
    transactionOppositeFee,
    showExAnteReportLink,
    freeSpaceNew,
    transactionFees
) {
    this.orderId = orderId;
    this.confirmationId = confirmationId;
    this.fees = transactionFees;
    this.transactionOppositeFee = transactionOppositeFee;
    this.showExAnteReportLink = showExAnteReportLink;
    this.freeSpaceNew = freeSpaceNew;
}


function Product(id, name, symbol, size, price, value, realizedProductPl, realizedFxPl) {
    this.id = id;
    this.name = name;
    this.symbol = symbol;
    this.size = size;
    this.price = price;
    this.value = value;
    this.realizedProductPl = realizedProductPl;
    this.realizedFxPl = realizedFxPl;
}

export const login = async (otpCode) => {
    const DeGiro = degiro.default;
    try {
        const degiro = new DeGiro({
            username: process.env.DEGIRO_USER,
            pwd: process.env.DEGIRO_PWD,
            oneTimePassword: otpCode
        })
        await degiro.login();

        // Get the jsessionId (LOOK, is not a promise)
        //const jsessionId = degiro.getJSESSIONID();
        return degiro;

    } catch (e) {
        console.error(e);
    }
}

export const getPortfolio = async ({otpCode}) => {
    try {
        const degiro = await login(otpCode);
        const portfolio = await degiro.getPortfolio({
            type: PORTFOLIO_POSITIONS_TYPE_ENUM.OPEN,
            getProductDetails: true,
        });

        const data = portfolio.reduce((acc, value) => {
            acc.push(new Product(
                value.id,
                value.productData.name,
                value.productData.symbol,
                value.size,
                value.price,
                value.value,
                value.realizedProductPl,
                value.realizedFxPl
            ));
            return acc;
        }, []);

        console.table(data);

    } catch (e) {
        console.error(e);
    }
}

export const closePositions = async ({otpCode}) => {
    try {
        const degiro = await login(otpCode);
        const portfolio = await degiro.getPortfolio({
            type: PORTFOLIO_POSITIONS_TYPE_ENUM.OPEN,
            getProductDetails: true,
        });

        const result = await Promise.all(
            portfolio.map(async ({id, size}) => {
                const order = {
                    buySell: DeGiroActions.SELL,
                    orderType: DeGiroMarketOrderTypes.MARKET,
                    productId: id,
                    size: size
                };

                const {
                    confirmationId,
                    transactionOppositeFee,
                    showExAnteReportLink,
                    freeSpaceNew,
                    transactionFees
                } = await degiro.createOrder(order)

                const orderId = await degiro.executeOrder(order, confirmationId)

                return new OrderConfirmation(
                    orderId,
                    confirmationId,
                    transactionOppositeFee,
                    showExAnteReportLink,
                    freeSpaceNew,
                    transactionFees
                );
            })
        );

        console.table(result);

    } catch (e) {
        console.error(e);
    }
}
