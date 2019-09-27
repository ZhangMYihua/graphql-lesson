import {gql} from 'apollo-boost';
import {addItemToCart} from './cart.utils'



export const typeDefs = gql`
    extend type Item{
        quantity: Int
    }
    extend type Mutation {
        ToggleCartHidden: Boolean!
        AddItemToCart(item: Item!): [item]!
    }
`;

const GET_CART_HIDDEN = gql`
{
    cartHidden @client
}
`;

const GET_CART_ITEMS =gql`
    {
        cartItem @client
    }
`;


export const resolvers = {
    Mutation: {
        toggleCartHidden: (_root, _args, {cache}) => {
            const {cartHidden} = cache.readQuery({
                query: GET_CART_HIDDEN
            })

            cache.writeQuery({
                query: GET_CART_HIDDEN,
                data: {cartHidden: !cartHidden}
            })

            return !cartHidden         
        },

        AddItemToCart: (_root, {item}, {cache}) => {
            const { cartItems } = cache.readQuery({
                query: GET_CART_ITEMS
            });

            const newCartItems = addItemToCart(cartItems, item);

            cache.writeQuery({
                query: GET_CART_ITEMS,
                data: {cartItems: newCartItems}
            })
        }
    }
}