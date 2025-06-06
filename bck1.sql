PGDMP                      }            niyocf    17.4    17.1 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16384    niyocf    DATABASE     l   CREATE DATABASE niyocf WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';
    DROP DATABASE niyocf;
                     postgres    false            �            1259    16494    carts    TABLE     �   CREATE TABLE public.carts (
    user_id integer NOT NULL,
    product_id integer NOT NULL,
    size_id integer NOT NULL,
    count integer DEFAULT 1 NOT NULL,
    id integer NOT NULL
);
    DROP TABLE public.carts;
       public         heap r       postgres    false            �            1259    16493    carts_id_seq    SEQUENCE     �   CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.carts_id_seq;
       public               postgres    false    232            �           0    0    carts_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;
          public               postgres    false    231            �            1259    16390 
   categories    TABLE     �   CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(50),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.categories;
       public         heap r       postgres    false            �            1259    16389    categories_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.categories_id_seq;
       public               postgres    false    218            �           0    0    categories_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;
          public               postgres    false    217            �            1259    17139 
   deliveries    TABLE     �   CREATE TABLE public.deliveries (
    id integer NOT NULL,
    name character varying NOT NULL,
    fee integer DEFAULT 0 NOT NULL
);
    DROP TABLE public.deliveries;
       public         heap r       postgres    false            �            1259    17145    deliveries_id_seq    SEQUENCE     �   CREATE SEQUENCE public.deliveries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.deliveries_id_seq;
       public               postgres    false    243            �           0    0    deliveries_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.deliveries_id_seq OWNED BY public.deliveries.id;
          public               postgres    false    244            �            1259    16516 
   fcm_tokens    TABLE     �   CREATE TABLE public.fcm_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    token character varying NOT NULL,
    user_id integer NOT NULL,
    expired_time timestamp with time zone DEFAULT (now() + '00:10:00'::interval) NOT NULL
);
    DROP TABLE public.fcm_tokens;
       public         heap r       postgres    false            �            1259    16879    gallery    TABLE     �   CREATE TABLE public.gallery (
    id integer NOT NULL,
    image text NOT NULL,
    description text NOT NULL,
    date date NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.gallery;
       public         heap r       postgres    false            �            1259    16886    gallery_id_seq    SEQUENCE     �   CREATE SEQUENCE public.gallery_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.gallery_id_seq;
       public               postgres    false    241            �           0    0    gallery_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.gallery_id_seq OWNED BY public.gallery.id;
          public               postgres    false    242            �            1259    17146    payments    TABLE     �   CREATE TABLE public.payments (
    code character varying(10) NOT NULL,
    name character varying(255),
    min_amount integer DEFAULT 0 NOT NULL,
    max_amount integer DEFAULT 0 NOT NULL,
    fee integer DEFAULT 0 NOT NULL,
    id integer NOT NULL
);
    DROP TABLE public.payments;
       public         heap r       postgres    false            �            1259    17152    payments_id_seq    SEQUENCE     �   ALTER TABLE public.payments ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               postgres    false    245            �            1259    16419    product_size    TABLE     �   CREATE TABLE public.product_size (
    id integer NOT NULL,
    name character varying(4) NOT NULL,
    price numeric(3,2) DEFAULT 0 NOT NULL
);
     DROP TABLE public.product_size;
       public         heap r       postgres    false            �            1259    16418    product_size_id_seq    SEQUENCE     �   CREATE SEQUENCE public.product_size_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.product_size_id_seq;
       public               postgres    false    220            �           0    0    product_size_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.product_size_id_seq OWNED BY public.product_size.id;
          public               postgres    false    219            �            1259    16445    products    TABLE        CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(55),
    price integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    category_id integer DEFAULT 0 NOT NULL,
    img character varying(255),
    "desc" text
);
    DROP TABLE public.products;
       public         heap r       postgres    false            �            1259    16444    products_id_seq    SEQUENCE     �   CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.products_id_seq;
       public               postgres    false    226            �           0    0    products_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;
          public               postgres    false    225            �            1259    16462    promo    TABLE     l  CREATE TABLE public.promo (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    "desc" text NOT NULL,
    discount integer,
    start_date date,
    end_date date,
    coupon_code character varying(25) NOT NULL,
    product_id bigint,
    img character varying,
    CONSTRAINT promo_disc_check CHECK (((discount >= 1) AND (discount <= 100)))
);
    DROP TABLE public.promo;
       public         heap r       postgres    false            �            1259    16461    promo_id_seq    SEQUENCE     �   CREATE SEQUENCE public.promo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.promo_id_seq;
       public               postgres    false    228            �           0    0    promo_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.promo_id_seq OWNED BY public.promo.id;
          public               postgres    false    227            �            1259    16531    reset_password    TABLE       CREATE TABLE public.reset_password (
    id integer NOT NULL,
    user_id integer NOT NULL,
    verify character varying NOT NULL,
    code character varying(8) NOT NULL,
    expired_at timestamp without time zone DEFAULT (CURRENT_TIMESTAMP + '00:10:00'::interval) NOT NULL
);
 "   DROP TABLE public.reset_password;
       public         heap r       postgres    false            �            1259    16530    reset_password_id_seq    SEQUENCE     �   CREATE SEQUENCE public.reset_password_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.reset_password_id_seq;
       public               postgres    false    235            �           0    0    reset_password_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.reset_password_id_seq OWNED BY public.reset_password.id;
          public               postgres    false    234            �            1259    16427    roles    TABLE     \   CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying NOT NULL
);
    DROP TABLE public.roles;
       public         heap r       postgres    false            �            1259    16426    roles_id_seq    SEQUENCE     �   CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.roles_id_seq;
       public               postgres    false    222            �           0    0    roles_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;
          public               postgres    false    221            �            1259    16436    status    TABLE     T   CREATE TABLE public.status (
    id integer NOT NULL,
    name character varying
);
    DROP TABLE public.status;
       public         heap r       postgres    false            �            1259    16435    status_id_seq    SEQUENCE     �   CREATE SEQUENCE public.status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.status_id_seq;
       public               postgres    false    224            �           0    0    status_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.status_id_seq OWNED BY public.status.id;
          public               postgres    false    223            �            1259    17196    testimonials    TABLE     �  CREATE TABLE public.testimonials (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    location character varying(100) NOT NULL,
    rating numeric(2,1) NOT NULL,
    text text NOT NULL,
    image text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT testimonials_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric)))
);
     DROP TABLE public.testimonials;
       public         heap r       postgres    false            �            1259    17195    testimonials_id_seq    SEQUENCE     �   CREATE SEQUENCE public.testimonials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.testimonials_id_seq;
       public               postgres    false    248            �           0    0    testimonials_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.testimonials_id_seq OWNED BY public.testimonials.id;
          public               postgres    false    247            �            1259    16601    transaction_product_size    TABLE       CREATE TABLE public.transaction_product_size (
    transaction_id integer NOT NULL,
    product_id integer DEFAULT 0 NOT NULL,
    size_id integer DEFAULT 0 NOT NULL,
    qty character varying DEFAULT 1 NOT NULL,
    subtotal integer DEFAULT 0 NOT NULL,
    id integer NOT NULL
);
 ,   DROP TABLE public.transaction_product_size;
       public         heap r       postgres    false            �            1259    16600    transaction_product_size_id_seq    SEQUENCE     �   CREATE SEQUENCE public.transaction_product_size_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.transaction_product_size_id_seq;
       public               postgres    false    240            �           0    0    transaction_product_size_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.transaction_product_size_id_seq OWNED BY public.transaction_product_size.id;
          public               postgres    false    239            �            1259    16546    transactions    TABLE     �  CREATE TABLE public.transactions (
    id integer NOT NULL,
    user_id integer DEFAULT 0 NOT NULL,
    promo_id integer DEFAULT 0 NOT NULL,
    shipping_address character varying(255),
    transaction_time timestamp without time zone DEFAULT now(),
    notes text,
    delivery_id integer DEFAULT 1 NOT NULL,
    status_id integer DEFAULT 1 NOT NULL,
    payment_id integer,
    grand_total integer DEFAULT 0
);
     DROP TABLE public.transactions;
       public         heap r       postgres    false            �            1259    16545    transactions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.transactions_id_seq;
       public               postgres    false    237            �           0    0    transactions_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;
          public               postgres    false    236            �            1259    16585    user_profile    TABLE     p  CREATE TABLE public.user_profile (
    user_id integer DEFAULT 0 NOT NULL,
    display_name character varying(50),
    first_name character varying(50),
    last_name character varying(50),
    address text,
    birthdate date,
    img character varying(255),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    gender integer DEFAULT 1 NOT NULL
);
     DROP TABLE public.user_profile;
       public         heap r       postgres    false            �            1259    16477    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    phone_number character varying(18),
    role_id integer DEFAULT 1 NOT NULL
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    16476    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    230                        0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    229            �           2604    17153    carts id    DEFAULT     d   ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);
 7   ALTER TABLE public.carts ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    231    232    232            �           2604    17154    categories id    DEFAULT     n   ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);
 <   ALTER TABLE public.categories ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    218    217    218            �           2604    17155    deliveries id    DEFAULT     n   ALTER TABLE ONLY public.deliveries ALTER COLUMN id SET DEFAULT nextval('public.deliveries_id_seq'::regclass);
 <   ALTER TABLE public.deliveries ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    244    243            �           2604    17156 
   gallery id    DEFAULT     h   ALTER TABLE ONLY public.gallery ALTER COLUMN id SET DEFAULT nextval('public.gallery_id_seq'::regclass);
 9   ALTER TABLE public.gallery ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    242    241            �           2604    17157    product_size id    DEFAULT     r   ALTER TABLE ONLY public.product_size ALTER COLUMN id SET DEFAULT nextval('public.product_size_id_seq'::regclass);
 >   ALTER TABLE public.product_size ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220            �           2604    17158    products id    DEFAULT     j   ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);
 :   ALTER TABLE public.products ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    225    226    226            �           2604    17159    promo id    DEFAULT     d   ALTER TABLE ONLY public.promo ALTER COLUMN id SET DEFAULT nextval('public.promo_id_seq'::regclass);
 7   ALTER TABLE public.promo ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    227    228    228            �           2604    17160    reset_password id    DEFAULT     v   ALTER TABLE ONLY public.reset_password ALTER COLUMN id SET DEFAULT nextval('public.reset_password_id_seq'::regclass);
 @   ALTER TABLE public.reset_password ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    235    234    235            �           2604    17161    roles id    DEFAULT     d   ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);
 7   ALTER TABLE public.roles ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221    222            �           2604    17162 	   status id    DEFAULT     f   ALTER TABLE ONLY public.status ALTER COLUMN id SET DEFAULT nextval('public.status_id_seq'::regclass);
 8   ALTER TABLE public.status ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    223    224            �           2604    17199    testimonials id    DEFAULT     r   ALTER TABLE ONLY public.testimonials ALTER COLUMN id SET DEFAULT nextval('public.testimonials_id_seq'::regclass);
 >   ALTER TABLE public.testimonials ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    247    248    248            �           2604    17163    transaction_product_size id    DEFAULT     �   ALTER TABLE ONLY public.transaction_product_size ALTER COLUMN id SET DEFAULT nextval('public.transaction_product_size_id_seq'::regclass);
 J   ALTER TABLE public.transaction_product_size ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    239    240    240            �           2604    17164    transactions id    DEFAULT     r   ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);
 >   ALTER TABLE public.transactions ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    237    236    237            �           2604    17165    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    229    230    230            �          0    16494    carts 
   TABLE DATA           H   COPY public.carts (user_id, product_id, size_id, count, id) FROM stdin;
    public               postgres    false    232   ��       �          0    16390 
   categories 
   TABLE DATA           :   COPY public.categories (id, name, created_at) FROM stdin;
    public               postgres    false    218   ��       �          0    17139 
   deliveries 
   TABLE DATA           3   COPY public.deliveries (id, name, fee) FROM stdin;
    public               postgres    false    243   
�       �          0    16516 
   fcm_tokens 
   TABLE DATA           F   COPY public.fcm_tokens (id, token, user_id, expired_time) FROM stdin;
    public               postgres    false    233   '�       �          0    16879    gallery 
   TABLE DATA           W   COPY public.gallery (id, image, description, date, created_at, updated_at) FROM stdin;
    public               postgres    false    241   D�       �          0    17146    payments 
   TABLE DATA           O   COPY public.payments (code, name, min_amount, max_amount, fee, id) FROM stdin;
    public               postgres    false    245   ��       �          0    16419    product_size 
   TABLE DATA           7   COPY public.product_size (id, name, price) FROM stdin;
    public               postgres    false    220   ��       �          0    16445    products 
   TABLE DATA           Y   COPY public.products (id, name, price, created_at, category_id, img, "desc") FROM stdin;
    public               postgres    false    226   ֢       �          0    16462    promo 
   TABLE DATA           o   COPY public.promo (id, name, "desc", discount, start_date, end_date, coupon_code, product_id, img) FROM stdin;
    public               postgres    false    228   �       �          0    16531    reset_password 
   TABLE DATA           O   COPY public.reset_password (id, user_id, verify, code, expired_at) FROM stdin;
    public               postgres    false    235   Ш       �          0    16427    roles 
   TABLE DATA           )   COPY public.roles (id, name) FROM stdin;
    public               postgres    false    222   ��       �          0    16436    status 
   TABLE DATA           *   COPY public.status (id, name) FROM stdin;
    public               postgres    false    224   �       �          0    17196    testimonials 
   TABLE DATA           g   COPY public.testimonials (id, name, location, rating, text, image, created_at, updated_at) FROM stdin;
    public               postgres    false    248   8�       �          0    16601    transaction_product_size 
   TABLE DATA           j   COPY public.transaction_product_size (transaction_id, product_id, size_id, qty, subtotal, id) FROM stdin;
    public               postgres    false    240   ��       �          0    16546    transactions 
   TABLE DATA           �   COPY public.transactions (id, user_id, promo_id, shipping_address, transaction_time, notes, delivery_id, status_id, payment_id, grand_total) FROM stdin;
    public               postgres    false    237   ��       �          0    16585    user_profile 
   TABLE DATA           �   COPY public.user_profile (user_id, display_name, first_name, last_name, address, birthdate, img, created_at, gender) FROM stdin;
    public               postgres    false    238   ɩ       �          0    16477    users 
   TABLE DATA           K   COPY public.users (id, email, password, phone_number, role_id) FROM stdin;
    public               postgres    false    230   ��                  0    0    carts_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.carts_id_seq', 1, false);
          public               postgres    false    231                       0    0    categories_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.categories_id_seq', 1, false);
          public               postgres    false    217                       0    0    deliveries_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.deliveries_id_seq', 1, false);
          public               postgres    false    244                       0    0    gallery_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.gallery_id_seq', 13, true);
          public               postgres    false    242                       0    0    payments_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.payments_id_seq', 1, false);
          public               postgres    false    246                       0    0    product_size_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.product_size_id_seq', 1, false);
          public               postgres    false    219                       0    0    products_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.products_id_seq', 15, true);
          public               postgres    false    225                       0    0    promo_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.promo_id_seq', 8, true);
          public               postgres    false    227            	           0    0    reset_password_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.reset_password_id_seq', 1, false);
          public               postgres    false    234            
           0    0    roles_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.roles_id_seq', 1, false);
          public               postgres    false    221                       0    0    status_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.status_id_seq', 1, false);
          public               postgres    false    223                       0    0    testimonials_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.testimonials_id_seq', 8, true);
          public               postgres    false    247                       0    0    transaction_product_size_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.transaction_product_size_id_seq', 1, false);
          public               postgres    false    239                       0    0    transactions_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.transactions_id_seq', 20, true);
          public               postgres    false    236                       0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 10, true);
          public               postgres    false    229                       2606    16500    carts carts_pk 
   CONSTRAINT     L   ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pk PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.carts DROP CONSTRAINT carts_pk;
       public                 postgres    false    232                       2606    16396    categories categories_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public                 postgres    false    218            $           2606    17167    deliveries deliveries_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.deliveries DROP CONSTRAINT deliveries_pkey;
       public                 postgres    false    243            "           2606    17169    gallery gallery_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.gallery
    ADD CONSTRAINT gallery_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.gallery DROP CONSTRAINT gallery_pkey;
       public                 postgres    false    241                       2606    16559    transactions history_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT history_pkey PRIMARY KEY (id);
 C   ALTER TABLE ONLY public.transactions DROP CONSTRAINT history_pkey;
       public                 postgres    false    237                       2606    16524 %   fcm_tokens no_duplicate_token_in_1_id 
   CONSTRAINT     j   ALTER TABLE ONLY public.fcm_tokens
    ADD CONSTRAINT no_duplicate_token_in_1_id UNIQUE (token, user_id);
 O   ALTER TABLE ONLY public.fcm_tokens DROP CONSTRAINT no_duplicate_token_in_1_id;
       public                 postgres    false    233    233            &           2606    17171    payments payments_id_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_id_key UNIQUE (id);
 B   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_id_key;
       public                 postgres    false    245            (           2606    17173    payments payments_pk 
   CONSTRAINT     T   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pk PRIMARY KEY (code);
 >   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_pk;
       public                 postgres    false    245                       2606    16485    users phone_number_unique 
   CONSTRAINT     \   ALTER TABLE ONLY public.users
    ADD CONSTRAINT phone_number_unique UNIQUE (phone_number);
 C   ALTER TABLE ONLY public.users DROP CONSTRAINT phone_number_unique;
       public                 postgres    false    230                       2606    16425    product_size product_size_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.product_size
    ADD CONSTRAINT product_size_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.product_size DROP CONSTRAINT product_size_pkey;
       public                 postgres    false    220                       2606    16455    products products_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public                 postgres    false    226                       2606    16594 "   user_profile profile_user_id_as_pk 
   CONSTRAINT     e   ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT profile_user_id_as_pk PRIMARY KEY (user_id);
 L   ALTER TABLE ONLY public.user_profile DROP CONSTRAINT profile_user_id_as_pk;
       public                 postgres    false    238                       2606    16470    promo promo_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.promo
    ADD CONSTRAINT promo_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.promo DROP CONSTRAINT promo_pkey;
       public                 postgres    false    228                       2606    16539     reset_password reset_password_pk 
   CONSTRAINT     ^   ALTER TABLE ONLY public.reset_password
    ADD CONSTRAINT reset_password_pk PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.reset_password DROP CONSTRAINT reset_password_pk;
       public                 postgres    false    235                       2606    16434    roles roles_pk 
   CONSTRAINT     L   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pk PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_pk;
       public                 postgres    false    222            
           2606    16443    status status_pk 
   CONSTRAINT     N   ALTER TABLE ONLY public.status
    ADD CONSTRAINT status_pk PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.status DROP CONSTRAINT status_pk;
       public                 postgres    false    224            *           2606    17206    testimonials testimonials_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.testimonials DROP CONSTRAINT testimonials_pkey;
       public                 postgres    false    248                        2606    16612 4   transaction_product_size transaction_product_size_pk 
   CONSTRAINT     r   ALTER TABLE ONLY public.transaction_product_size
    ADD CONSTRAINT transaction_product_size_pk PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.transaction_product_size DROP CONSTRAINT transaction_product_size_pk;
       public                 postgres    false    240                       2606    16487    users unique_users_email 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_users_email UNIQUE (email);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT unique_users_email;
       public                 postgres    false    230                       2606    16483    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    230            .           2606    16501    carts cart_product_fk    FK CONSTRAINT     z   ALTER TABLE ONLY public.carts
    ADD CONSTRAINT cart_product_fk FOREIGN KEY (product_id) REFERENCES public.products(id);
 ?   ALTER TABLE ONLY public.carts DROP CONSTRAINT cart_product_fk;
       public               postgres    false    232    4876    226            /           2606    16506    carts cart_size_fk    FK CONSTRAINT     x   ALTER TABLE ONLY public.carts
    ADD CONSTRAINT cart_size_fk FOREIGN KEY (size_id) REFERENCES public.product_size(id);
 <   ALTER TABLE ONLY public.carts DROP CONSTRAINT cart_size_fk;
       public               postgres    false    4870    232    220            0           2606    16511    carts cart_user_fk    FK CONSTRAINT     q   ALTER TABLE ONLY public.carts
    ADD CONSTRAINT cart_user_fk FOREIGN KEY (user_id) REFERENCES public.users(id);
 <   ALTER TABLE ONLY public.carts DROP CONSTRAINT cart_user_fk;
       public               postgres    false    4884    232    230            1           2606    16525    fcm_tokens fcm_tokens_fk    FK CONSTRAINT     w   ALTER TABLE ONLY public.fcm_tokens
    ADD CONSTRAINT fcm_tokens_fk FOREIGN KEY (user_id) REFERENCES public.users(id);
 B   ALTER TABLE ONLY public.fcm_tokens DROP CONSTRAINT fcm_tokens_fk;
       public               postgres    false    4884    233    230            +           2606    16456    products product_category_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT product_category_fk FOREIGN KEY (category_id) REFERENCES public.categories(id);
 F   ALTER TABLE ONLY public.products DROP CONSTRAINT product_category_fk;
       public               postgres    false    218    4868    226            ,           2606    16471    promo promo_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.promo
    ADD CONSTRAINT promo_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;
 8   ALTER TABLE ONLY public.promo DROP CONSTRAINT promo_fk;
       public               postgres    false    4876    228    226            2           2606    16540     reset_password reset_password_fk    FK CONSTRAINT        ALTER TABLE ONLY public.reset_password
    ADD CONSTRAINT reset_password_fk FOREIGN KEY (user_id) REFERENCES public.users(id);
 J   ALTER TABLE ONLY public.reset_password DROP CONSTRAINT reset_password_fk;
       public               postgres    false    4884    235    230            9           2606    16613 &   transaction_product_size tps_productid    FK CONSTRAINT     �   ALTER TABLE ONLY public.transaction_product_size
    ADD CONSTRAINT tps_productid FOREIGN KEY (size_id) REFERENCES public.product_size(id);
 P   ALTER TABLE ONLY public.transaction_product_size DROP CONSTRAINT tps_productid;
       public               postgres    false    220    4870    240            :           2606    16618 #   transaction_product_size tps_sizeid    FK CONSTRAINT     �   ALTER TABLE ONLY public.transaction_product_size
    ADD CONSTRAINT tps_sizeid FOREIGN KEY (product_id) REFERENCES public.products(id);
 M   ALTER TABLE ONLY public.transaction_product_size DROP CONSTRAINT tps_sizeid;
       public               postgres    false    240    226    4876            ;           2606    16623 4   transaction_product_size transaction_product_size_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.transaction_product_size
    ADD CONSTRAINT transaction_product_size_fk FOREIGN KEY (transaction_id) REFERENCES public.transactions(id);
 ^   ALTER TABLE ONLY public.transaction_product_size DROP CONSTRAINT transaction_product_size_fk;
       public               postgres    false    237    4892    240            3           2606    17174 *   transactions transactions_delivery_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_delivery_id_fkey FOREIGN KEY (delivery_id) REFERENCES public.deliveries(id);
 T   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_delivery_id_fkey;
       public               postgres    false    243    237    4900            4           2606    17179 )   transactions transactions_payment_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id);
 S   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_payment_id_fkey;
       public               postgres    false    237    4902    245            5           2606    16570 '   transactions transactions_promo_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_promo_id_fkey FOREIGN KEY (promo_id) REFERENCES public.promo(id) ON UPDATE CASCADE ON DELETE CASCADE;
 Q   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_promo_id_fkey;
       public               postgres    false    228    237    4878            6           2606    16575 (   transactions transactions_status_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.status(id);
 R   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_status_id_fkey;
       public               postgres    false    224    4874    237            7           2606    16580 &   transactions transactions_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 P   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_user_id_fkey;
       public               postgres    false    230    237    4884            8           2606    16595    user_profile user_profile_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.user_profile DROP CONSTRAINT user_profile_fk;
       public               postgres    false    230    4884    238            -           2606    16488    users users_role    FK CONSTRAINT     o   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role FOREIGN KEY (role_id) REFERENCES public.roles(id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_role;
       public               postgres    false    230    4872    222            �      x������ � �      �   L   x�3�L�OKKM�4202�50�52V04�2��20ճ47303�2�����%�Θ3-??�
�Ĕ���b|�b���� F �      �      x������ � �      �      x������ � �      �   H  x��һn�0��_7�`�X�C�.�`0���\}�*�iSeh6K����/��4>G�U��e�+`a;T�щ�R��N�
̓��DXP&�2��2�r���}��E��s1�q����i���*G$!l��MB�'1�r��B!1e�N�+'x�nGR�����w�5�i}S��.����J�I
��I*�$�=�b�YOZ[��Ou��B.����&�.Iv'��'�����c%�]��ac:��(U��AG�M��2��8�?�2�
�3q��U�<����&F�^�_Rf:����_�g���g=;�̀YN$�����D�x� �O_���      �      x������ � �      �      x������ � �      �   �  x��WMs�8=3�B?`� >��[vS��k���Ԟri@!�����ے����=dn[�*�H��=�n��?��SEA��C�>�9�E�e��Y��E�A��4���bsX��4\�:��8�C�?�4;�Zv0��9<�<�N�1��A��X?&56��.q��&����O�#�g��{�D��{&@���A��0�~Oz8�޽��4a�����/�&h��͙��a&�b7i�l��lfCfւ�G��+��5�܁�b0�����?q`��l��t�f��*}@�W��Q��8)EP��:�EE�1�OU�zL}�&�VkpKX��;������2�� {���XF4L�(*�{j>%Yq��`��k~4���k�h���f*���ɏȩ��j|�c�[˻�]��q,� =�؏;�zb�=k���9LVFi��e������f��z����C���aK��3�V ���	k@�j�]�	:�����|R�I�4~Ņ��iI�0.Nx��N�G\OosQ?UPx.�\�������8q�;{��0%�T�r�˿����K3x����ڵf}�@�s����8�P�_#��t�;���k#и}�B�Q\r�F�ܫ@q��U�N�&�u��ڇ:O XՀ��˃���k�Y��0��,)�լH޹UĢ�S`���Ջ�\֋�1��-P�f�Y�q�������3Ho��Wz9�fR�~3_|2݆�3,�" O��f^�I;���g��'�M*L��*vE�	�^�ֈ-�2���1��)H�hn4�n����y���وX�5(��Aт�~� 
�Ȉ���*��ݷ���+KIe�'2O�F��#��n�0�V�Y��Y�V~�+��~?���;o0~[���iå� �� ��]�N�6�Ft��&�4*i�"�E����6�h�1��Q��g֐��xf���и�E��e(�$I�1�<I������b�tm��zk_~��8�V����f�-������![�����qK4���V�H���&؎�D\���-oߌp1��l���ɘ&%M�"N��]�N�w ��J��x�䵰��	2�В����ߺ��Oz��zP�f�J�+yk�k3F�qZ^���/����	[Î&��wbeVFQX�iq���;�s~Z����pB�8ʥLW���7���о�/��%/6��d��Z����q�����d	e�U���<��=Ζ�wa�F9�q�%>s��08�t��3�6�ݷp���@��h      �   �   x��νn�0��<�� `��^�E��ݺp�e����[Ҩ?R�n���~�N�������,~TRޚQ�U�t-G4�V�v�ST���K�W�kԶ-��C��xOHP��'�meX���d�..��g��H�y������Wן���u�C�:�}���8���k���i�+�.��7*�-b?��Wd%:>������벁��Nt��\dY�PUp�      �      x������ � �      �      x�3��M�MJ-�2�LL�������� H��      �      x������ � �      �   G   x���,NM�I��,.-JLJ�L�4�3�L����q�����)X�X�����[X������ ��      �      x������ � �      �      x������ � �      �   �   x�}�9�0Dk�������� 'Hc�@�g��$	*�)��<$�-n��OPJ�$0��,���ꙗ]Z������tU7Nn�ڈ���X�.�J<�ity�}���Ô���ٻǐ?�˰��aR1T� MІK�� A�2?V��\Py��a�"@A�!�eǾJs��D�)�/��?      �   �   x�e�KR�0  �u8Gהɮ�R>�)��&���S>���u���yt%+k�IH�U�z�;�A��M��yIpᩆ�7z�pN�m�;�pcfOUޅ��ۣ+���.{���	��	�B+:q����Ŝ)��߱���H۩�T�ÐO�yb��� g9�0R���i}�P9�͒���|��ӓ�h��=�WYe�eS�
����+m�8�K�Y��ش�ʇ�(�G1W�     