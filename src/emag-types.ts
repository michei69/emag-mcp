export type Result<T, K = any> = {
    code: number,
    data: T,
    metadata?: K,
    notifications: {}|{[key: string]: ResultNotification}|null,
    
    // m-api
    auth_token?: string,
    tokens?: string
}

export type ResultNotification = {
    type: "generic",
    key: "auth",
    message: string
}

export type NavAllResult = {
    navs: Nav[],
    limit: number,
    count: number
}
export type Nav = {
    id: number,
    parent_id: number,
    sef_name: string,
    type: "item",
    name: string,
    url: string,
    image: string,
    deeplink: string,
    selected: boolean,
    no_follow: boolean,
    is_adult_only: boolean,

    siblings?: Nav[],
    widgets?: NavWidget[]
}
export type NavWidget = {
    id: number,
    type: "children"|"products",
    name: string,
    nav_ref: "children-16-1",
    display_type?: "photos",
    display_orientation?: "horizontal",
    children?: Nav[],
    products: {} // TODO
}

export type SearchResult = {
    short_title: string,
    title: string,
    category: SearchCategory,
    conditions: {
        filters: { [key: string]: any }
    },
    items: SearchItem[],
    filters: SearchFilterParent,
    quick_filters: SearchFilterParent,
    shop: {
        id: number,
    },
    logger: {
        search_id: string,
        key: string,
        section: "category"
    },
    flags: {
      has_fallback: boolean,
      has_redirect: boolean,
      has_applied_filters: boolean,
      has_applied_visible_filters: boolean,
      has_applied_quick_filters: boolean,
      has_applied_listing_filters: boolean,
      has_search_terms: boolean,
      has_recommended_categories: boolean,
      has_more_rupture_categories: boolean,
      has_widget_more_rupture_categories: boolean,
      has_trending_searches: boolean,
      has_similar_searches: boolean,
      has_relevant_categories: boolean,
      is_ads_eligible: boolean
    },
    alternative_result_data: {
        shop_id: number,
        url: Url,
        count: number,
    },
    menu: any, // TODO
    breadcrumbs: Array<{
        name: string,
        url: Url
    }>,
    pagination: {
        position_item_start: number,
        position_item_end: number,
        items_count: number,
        items_per_page: number,
        previous_page: SearchPage,
        next_page: SearchPage,
        pages: SearchPage[]
    },
    display_data: any, // TODO
    base_url: Url,
    url: Url,
    canonical_url: Url,
    trending_searches: any[],
    similar_searches: any[],
    relevant_searches: any[],
    statistics: {
        medium_price: number,
        min_price_offer_id: number
    },
    showrooms: Showroom[],
    ua_info: any, // TODO
    debug_query: [],
    delivered_by_tazz: [],
    digital_services_act: any, // lazy
    ads_zone: string,
    ads: any, // lazy
    campaigns: {
        has_personalized_campaigns: boolean
    },

    deeplink?: string
}
export type SearchPage = {
    id: number,
    url: Url,
    is_selected: boolean
}
export type SearchCategory = {
    id: number,
    name: string,
    sef_name: string,
    display_type: "default",
    department: SearchCategoryDepartment,
    subdepartment: SearchCategoryDepartment,
    trail: string,
    listing_id: number,
    english_name: string,
    configurator: any, // TODO
    tags: string[],
    is_adult_only: boolean,
    is_active: boolean
}
export type SearchCategoryDepartment = {
    id: number,
    name: string,
    sef_name: string
}

export type SearchItem = {
    id: number,
    name: string,
    part_number_key: string,
    image: ItemImageData,
    characteristics: {
        listing: [{
            name: string,
            characteristics: ListingCharacteristic[]
        }]
    },
    multiple_offers_count: number,
    used_offers_count: number,
    offers_count: number,
    multiple_min_price: number,
    used_min_price: number,
    offer: ItemOffer,
    feedback: {
        rating: number,
        questions: {
            count: number,
            add_url: Url
        },
        answers: number,
        reviews: {
            count: number,
            add_url: Url,
            view_url: Url
        }
    },
    url: Url,
    quick_uri: string,
    sef_name: string,
    scm_super_category: {
        id: number,
        name: string
    },
    availability_key: number,
    resource: {
        type: "products",
        id: "string"
    },
    used_offer_id_having_min_price: number,
    added_to_favorites_count: number
}
export type ItemImageData = {
    original: string,
    resized_images?: Array<{
        size: string,
        url: string
    }>
}
export type ListingCharacteristic = {
    id: number,
    name: string,
    value: {
        id: number,
        value: string,
        unit_of_measure: {
            id: number,
            name: string,
            symbol: string
        },
    },
    order: number
}
export type ItemOffer = {
    id: number,
    type: number,
    price: OfferPrice,
    flags: {
        is_main: boolean,
        is_used: boolean,
        is_sales: boolean,
        is_active: boolean,
        has_discount: boolean,
        may_be_ordered: boolean,
        has_ecredit: boolean,
        has_bundles: boolean,
        has_gifts: boolean,
        has_bundle_first: boolean,
        is_self_source: boolean,
        has_warranty: boolean,
        has_badges: boolean,
        is_visible: boolean,
        has_services: boolean,
        has_buyback: boolean,
        has_buyback_v2: boolean,
        has_two_hour_delivery: boolean,
        has_same_day_delivery: boolean,
        has_three_hour_delivery: boolean,
        has_free_delivery: boolean,
        has_delivery_estimate: boolean,
        has_pickup: boolean,
        has_unified_badges: boolean,
        has_loyalty_points: boolean,
        has_banners: boolean,
        is_fulfilment_by_emag: boolean,
        show_legal_price: boolean,
        has_free_return: boolean,
        is_open_package: boolean,
        is_bf: boolean,
        has_campaign_badge: boolean,
        has_visible_badge_border: boolean,
        is_custom_discount: boolean,
        has_unfair_price: boolean,
        is_genius_eligible: boolean,
        is_genius_exclusive: boolean,
        genius_eligibility_type: number,
        has_courier_6h_delivery: boolean,
        only_in_showroom: boolean,
        is_adult_only: boolean
    },
    available_delivery_methods: string[],
    unit: {
        id: number,
        name: string,
        value: number,
    },
    legal_unit: {
        id: number,
        name: string,
        value: number,
    },
    vendor: OfferVendor,
    vendor_type: number,
    availability: OfferAvailability,
    part_number: string,
    display_type: "default",
    loyalty: {
        discount_bau: number,
        discount_cmp: number,
        campaign_id: number
    },
    labels: OfferLabel[],
    url_genius: string,
    url_genius_badge: string,
    url_genius_badge_rounded: string,
    return_period: number,
    redirect_custom_discount: {
        is_custom_discount: boolean,
    },
    wallet_information: any, // TODO
    purchasable_type: "tangible_goods",
    main_offer_id: number
}
export type OfferPrice = {
    current: number,
    is_min: boolean,
    is_max: boolean,
    legal: number,
    prefix: string,
    suffix: string,
    is_visible: boolean,
    discount: {
        type: "percent",
        absolute: number,
        percent: number,
        is_special: boolean,
        is_visible: boolean,
        is_restricted_from_view: boolean,
        is_max: boolean,
        label: string,
        labeled_as_discount: boolean,
    },
    currency: {
        id: number,
        name: Name
    },
    net: number,
    recommended_retail_price: OfferPriceInfo,
    lowest_price_30_days: OfferPriceInfo,
    initial: number,
} 
export type OfferPriceInfo = {
    amount: number,
    is_visible: boolean,
    label?: string,
    tooltip: string,
}
export type OfferVendor = {
    id: number,
    name: Name,
    sef_name: string,
    url: Url,
    is_fde_eligible: boolean,
    is_active: boolean,
}
export type Name = {
    default: string,
    display: string
}
export type Url = {
    path: string,
    desktop_base: string,
    mobile_base: string,
}
export type OfferAvailability = {
    id: number,
    text: string,
    code: "limited_stock_qty",
    days_estimation: number,
    color: {
        r: number,
        g: number,
        b: number,
        a: number
    },
    display_type: "default"
}
export type OfferLabel = {
    id: number,
    name: string,
    icon: {
        char_code: string,
        name: "open_fill"|"return-14"
    },
    path: {
        original: string
    }
}
export type SearchFilterParent = {
    items: SearchFilter[],
    type: "default"|"quick",
    products_distance: number
}
export type SearchFilter = {
    id: number,
    name: string,
    base_url: Url,
    is_selected: boolean,
    type: {
        id: number,
        name: string
    },
    displayed_items_count: number,
    total_items_count: number,
    choice_type: "multiple",
    is_visible: boolean,
    items: SearchFilterItem[],
    children: [],
    is_quickfilter: boolean,
    has_reference_system: boolean,
    is_cross_filter: boolean,
    is_navigation_filter: boolean,
    is_quick_values: boolean,
    values_are_computed: boolean,
    values_are_complete: boolean,
}
export type SearchFilterItem = {
    id: string,
    type: "default",
    name: string,
    sef_name: string,
    value: string,
    url: Url,
    count: number,
    is_selected: boolean,
    children: []
}
export type Showroom = {
    id: number,
    name: string,
    sef_name: string,
    common_key: string,
    scm_id: number,
    locality: {
        id: number,
        name: string
    }
    region: {
        id: number,
        name: string
    },
    latitude: {
        initial: number,
        min: number,
        max: number
    }
    longitude: {
        initial: number,
        min: number,
        max: number
    }
}

export type ItemDetails = {
    id: number,
    category: SearchCategory,
    name: string,
    part_number_key: string,
    ean: string,
    brand: ItemBrand,
    image: ItemImageData,
    image_gallery: ItemImageData[],
    description: {
        trimmed_plain_no_tags_video_space: string
    },
    characteristics: {
        visible: [{
            name: string,
            characteristics: ListingCharacteristic[]
        }]
    },
    multiple_offers: ItemOffer[],
    multiple_offers_count: number,
    used_offers_count: number,
    offers_count: number,
    multiple_min_price: number,
    used_min_price: number,
    offer: ItemOffer,
    feedback: {
        rating: number,
        questions: {
            count: number,
            first_item: ItemComment,
            items: ItemComment[],
            add_url: Url,
            view_url: Url
        },
        answers: number,
        reviews: ItemDetailedReviews
    },
    url: Url,
    quick_uri: string,
    sef_name: string,
    scm_super_category: {
        id: number,
        name: string
    },
    flags: {
      has_multiple: boolean,
      has_used: boolean,
      has_description: boolean,
      has_characteristics: boolean,
      has_image_gallery: boolean,
      has_video_gallery: boolean,
      has_image: boolean,
      has_image360: boolean,
      has_offer: boolean,
      has_family: boolean,
      is_family: boolean,
      has_profiling_widgets: boolean,
      has_datalayer_info: boolean,
      may_be_compared: boolean,
      is_infringement: boolean,
      show_active_users: boolean,
      allow_favorites: boolean,
      allow_feedback: boolean,
      display_price_per_unit: boolean,
      is_adult_only: boolean,
      enforce_bnpl_and_slice4: boolean
    },
    family: ItemFamily,
    availability_key: number,
    resource: {
        type: "products",
        id: string,
    },
    used_offer_id_having_min_price: number,
    webview_urls: {
        [key: string]: Url
    },
    added_to_favorites_count: number,
    general_product_safety_regulation: {
        button_text: string,
        challenge: string,
        url: Url
    },
}
export type ItemBrand = {
    id: number,
    name: string,
    sef_name: string,
    url: Url,
    is_active: boolean,
    tags: string[],
    image: ItemImageData
}
export type ReviewUser = {
    id: number,
    hash: string,
    name: string,
    user_avatar: {
        initials: string,
        path: string,
        background_color: string,
        image: ItemImageData
    },
    nickname: string,
    url: Url,
    is_official: boolean,
}
export type ItemComment = {
    id: number,
    content: string,
    user: ReviewUser,
    is_active: boolean,
    moderation_status: "moderated_accepted",
    created: Date,
    modified: Date,
    published: Date,
    edit_url: Url,
    view_url: Url,
    type: "QUESTION"|"ANSWER"|"REVIEW",
    product: ItemQuestionProduct,
    content_no_tags: string,
    
    // QUESTION
    answers?: ItemComment[]

    // ANSWER
    parent_id?: number,
    
    // ANSWER + REVIEW
    votes?: number,
    current_customer_has_voted: boolean
    
    // REVIEW
    report_reason?: string,
    is_bought?: boolean,
    brand_id?: number,
    category_id?: number,
    offer_id?: number,
    client_type?: string,
    client_type_info?: string,
    product_doc_id?: number,
    product_family_id?: number,
    allow_comments_likes?: boolean,
    has_media?: boolean,
    pictures?: Array<ItemImageData>,
    title?: string,
    rating?: number
}
export type ItemQuestionProduct = {
    id: number,
    name: string,
    part_number_key: string,
    image: ItemImageData,
    family_characteristics: {
        name: string,
        characteristics: Array<{
            id: number,
            name: string,
            value: {
                id: number,
                value: string,
            },
            order: number
        }>
    },
    offer: ItemOffer,
    url: Url,
    sef_name: string,
}
export type ReviewSortOption = {
    name: string,
    direction: "desc",
    placeholder: string,
    isSelected: boolean,
    isDefault:boolean,
}

export type ItemFamily = {
    id: number,
    name: string,
    sef_name: string,
    labels: {
        short: string,
        detailed: string,
    },
    icon: ItemImageData,
    characteristics: Array<{
        id: number,
        name: string,
        label: string,
        display_type: "text",
        sef_name: string,
        is_selected: boolean,
        products: Array<{
            id: number,
            offer_id: number,
            product_id: number,
            label: string,
            sef_name: string,
            part_number_key: string,
            url: Url,
            price: OfferPrice,
            is_available: boolean,
            status: string,
            is_selected: boolean,
            resource: {
                type: "products",
                id: "string"
            },
            name: string,
            main_offer_id: number,
            may_be_ordered: boolean,
            is_genius_exclusive: boolean,
        }>,
        has_sizechart: boolean
    }>
}

export type ItemDetailsMetadata = {
    product_id: number,
    category_id: number,
    brand_id: number,
    family_id: number,
    availability_id: number,
    product_status: boolean, // ???
    doc_id: number,
    price_current: number,
    price_initial: number,
    page_content: {
        is_modified: boolean,
        last_modified: number
    }
}
export type ItemDetailedReviews = {
    count: number,
    first_item: ItemComment,
    items: ItemComment[],
    rating_distribution: {
        "5": number,
        "4": number,
        "3": number,
        "2": number,
        "1": number
    },
    add_url: Url,
    view_url: Url,
    family_id: number,
    sort_options: ReviewSortOption[],
    positive_rating_percentage: number,
    bought_count: number,
    bought_count_filter: string,
    bought_count_message: string,
    positive_rating_percentage_message: string,
    messages: {
        tag_info_text: string,
        tag_info_modal_text: string,
        tag_filter_text: string
    }
}