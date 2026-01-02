import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import Emag from "./emag";
import { type ItemDetailedReviews, type ItemDetails, type ItemDetailsMetadata, type Nav, type NavAllResult, type SearchResult } from "./emag-types";

// Create server instance
const server = new McpServer({
    name: "emag",
    version: "1.0.0",
});
const client = new Emag()

server.registerTool(
    "get_product_categories",
    {
        description: "Get all main product categories. Use chosen category url with get_product_category to fetch subcategories.",
    },
    async () => {
        const categories = await client.fetchSApi<NavAllResult>("/nav/all")
        const output = {categories: categories.navs.map((cat) => ({name: cat.name, url: cat.url.split("?")[0], id: cat.deeplink?.split("category_id=")[1]?.split("&")[0]}))}
        return {
            content: [{
                type: "text",
                text: JSON.stringify(output)
            }],
            structuredContent: output
        }
    }
)

server.registerTool(
    "get_product_category",
    {
        description: "Get a product subcategory with a url path. Use chosen category url with get_product_category to fetch subcategories. Use chosen category id with search to fetch products from said subcategory. (E.g. you would call get_product_category until you reach Telefoane Mobile, which is a detailed category, and then you would issue a search with its id). It's best to search for a specific category, than searching a vague term like `telefoane`.",
        inputSchema: {
            url: z.string().describe('Url of the category to open (e.g. `/nav/it-mobile`)')
        }
    },
    async ({url}: {url: string}) => {
        const category = await client.fetchSApi<Nav>(url)
        const output = {categories: category.widgets?.filter(c => c.type == "children")[0]?.children?.map((cat) => ({name: cat.name, url: cat.url.split("?")[0], id: cat.deeplink?.split("category_id=")[1]?.split("&")[0]}))}
        return {
            content: [{
                type: "text",
                text: JSON.stringify(output)
            }],
            structuredContent: output
        }
    }
)

server.registerTool(
    "search",
    {
        description: "Search for products using a query, category, and / or filters.",
        inputSchema: {
            query: z.string().optional().describe('Query to search for'),
            category: z.number().optional().describe('Category ID to search in'),
            filters: z.record(z.string(), z.array(z.number())).optional().describe('Object with filters like {7885: [31004]} (Tip Procesor -> Apple M3)'),
            page_offset: z.number().optional().describe("Page offset (the count of items to skip)"),
            minPrice: z.number().optional().describe("Minimum price in RON. Must be set together with maxPrice"),
            maxPrice: z.number().optional().describe("Maximum price in RON. Must be set together with minPrice"),
        },
    },
    async ({query, category, filters, page_offset, minPrice, maxPrice}) => {
        const params = new URLSearchParams()
        if (query) params.set("filters[query]", query)
        if (category) params.set("filters[category][]", category.toString())
        if (filters) Object.entries(filters).forEach(([key, value]) => value.forEach((v, _) => params.set(`filters[custom_filter][${key}][${Math.floor(Math.random()*1000)}]`, v.toString())))
        if (page_offset) params.set("page[offset]", page_offset.toString())
        if ((minPrice || minPrice === 0) && maxPrice) params.set("filters[price][6411]",`${minPrice}-${maxPrice}`)

        const data = await client.fetchSApi<SearchResult>("/search-by-filters-with-redirect?" + params)
        if (data.deeplink?.includes("category_id")) {
            return {
                content: [{
                    type: "text",
                    text: `Use search with \`category\` set to ${data.deeplink.split("=")[1]} instead`
                }]
            }
        }
        const output = {
            next_page_offset: data.pagination.items_count,
            items: data.items.map((item) => ({
                product_id: item.part_number_key,
                title: item.name,
                specifications: item.characteristics?.listing?.flatMap((ch) => `${ch.name}:\n- ${ch.characteristics.flatMap((c) => `${c.name}: ${c.value.value}${c.value.unit_of_measure?.symbol ?? ""}`).join("\n- ")}`),
                rating: item.feedback.rating,
                rating_count: item.feedback.reviews.count,
                price: item.offer.price.prefix + item.offer.price.current + item.offer.price.suffix,
                availability: item.offer.availability.text
            })),
            filters: data.filters.items.flatMap((ch) => ({
                name: ch.name,
                id: ch.id,
                is_selected: ch.is_selected,
                options: ch.items.map((option) => ({
                    name: option.name,
                    id: option.id,
                    is_selected: option.is_selected
                })),
                choice_type: ch.choice_type
            }))
        }
        return {
            content: [{
                type: "text",
                text: JSON.stringify(output)
            }],
            structuredContent: output
        }
    }
)

server.registerTool(
    "get_product_page",
    {
        description: "Get a product's page",
        inputSchema: {
            product_id: z.string().describe('Product ID'),
        },
    },
    async ({product_id}) => {
        const params = new URLSearchParams({
            "fields[campaigns]": "1",
            "fields[feedback][reviews][rating_distribution]": "1",
            "fields[labels]": "1",
            "templates[]": "custom_lite"
        })

        const item = await client.fetchSApi<ItemDetails, ItemDetailsMetadata>(`/products/${product_id}?` + params)
        const output = {
            product_id: item.part_number_key,
            title: item.name,
            specifications: item.characteristics?.visible?.flatMap((ch) => `${ch.name}:\n- ${ch.characteristics.flatMap((c) => `${c.name}: ${c.value.value}${c.value.unit_of_measure?.symbol ?? ""}`).join("\n- ")}`),
            rating: item.feedback.rating,
            rating_count: item.feedback.reviews.count,
            other_options: item.family?.characteristics?.flatMap((ch) => ch.products.flatMap((p) => ({
                product_id: p.part_number_key,
                label: p.label,
                price: p.price.prefix + p.price.current + p.price.suffix,
                is_selected: p.is_selected,
                status: p.status,
                title: p.name
            })))
        }
        return {
            content: [{
                type: "text",
                text: JSON.stringify(output)
            }],
            structuredContent: output
        }
    }
)

server.registerTool(
    "get_product_reviews",
    {
        description: "Get a product's reviews",
        inputSchema: {
            product_id: z.string().describe('Product ID'),
        },
    },
    async ({product_id}) => {
        const params = new URLSearchParams({
            "fields[items]": "1",
            "fields[items][content_no_tags]": "1",
        })
        const reviews = await client.fetchSApi<ItemDetailedReviews>(`/products/${product_id}/reviews?${params}`)

        const output = {
            reviews: reviews.items.map((review) => ({
                title: review.title,
                content: review.content,
                product: {
                    name: review.product.name,
                    product_id: review.product.part_number_key,
                    specifications: review.product.family_characteristics.characteristics.flatMap((ch) => `${ch.name}: ${ch.value.value}`).join("\n"),
                    price: review.product.offer.price.prefix + review.product.offer.price.current + review.product.offer.price.suffix,
                },
                actually_bought: review.is_bought,
                rating: review.rating,
                votes: review.votes,
            }))
        }
        return {
            content: [{
                type: "text",
                text: JSON.stringify(output)
            }],
            structuredContent: output
        }
    }
)

const transport = new StdioServerTransport()
await server.connect(transport)