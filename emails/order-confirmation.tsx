import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "react-email";
import { Logo } from "./components/Logo";
import { thEach, thIf, thRemove, thText } from "./lib/thymeleaf";

interface Product {
  name: string;
  description: string;
  price: number;
  discount: number;
  amount: number;
  lineTotal: number;
}

interface Order {
  number: string;
  date: string;
  items: Product[];
  subtotal: number;
  totalDiscount: number;
  total: number;
}

interface OrderConfirmationEmailProps {
  order?: Order;
}

const formatEur = (value: number) =>
  `€${value.toLocaleString("en-IE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Build a Thymeleaf inline-text expression that prints a number as "€12.34".
// Regular (non-template) string, so the literal ${...} survives for Thymeleaf.
const eurExpr = (path: string, prefix = "€") =>
  "|" + prefix + "${#numbers.formatDecimal(" + path + ", 1, 2, 'POINT')}|";

const theme = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        foreground: "#252525",
        muted: "#8d8d8d",
        subtle: "#e5e5e5",
        page: "#fafafa",
      },
      fontFamily: {
        sans: ["Geist", "Helvetica", "Arial", "sans-serif"],
      },
      maxWidth: {
        150: "600px",
      },
      width: {
        22: "88px",
      },
    },
  },
};

export const OrderConfirmationEmail = ({
  order = sampleOrder,
}: OrderConfirmationEmailProps) => (
  <Html lang="en">
    <Head>
      <Font
        fontFamily="Geist"
        fallbackFontFamily="Helvetica"
        webFont={{
          url: "https://cdn.jsdelivr.net/npm/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2",
          format: "woff2",
        }}
        fontWeight={400}
        fontStyle="normal"
      />
    </Head>
    <Tailwind config={theme}>
      <Preview>
        Your MicroMarket order {order.number} is confirmed
      </Preview>
      <Body className="bg-page font-sans text-foreground">
        <Container className="mx-auto my-8 max-w-150 rounded-lg border border-solid border-subtle bg-white px-8 py-7">
          <Logo />

          <Hr className="my-6 border-subtle" />

          <Heading
            as="h1"
            className="m-0 text-2xl font-semibold leading-tight text-foreground"
          >
            Your order is confirmed
          </Heading>
          <Text className="mt-2 mb-0 text-sm text-muted">
            Order{" "}
            <span className="text-foreground" {...thText("${order.number}")}>
              {order.number}
            </span>
            {" · "}
            <span {...thText("${order.date}")}>{order.date}</span>
          </Text>

          <Section className="mt-8">
            <Row>
              <Column className="border-0 border-b border-solid border-subtle pb-2 text-[11px] font-medium uppercase tracking-wider text-muted">
                Product
              </Column>
              <Column
                align="right"
                className="w-12 border-0 border-b border-solid border-subtle pb-2 text-[11px] font-medium uppercase tracking-wider text-muted"
              >
                Qty
              </Column>
              <Column
                align="right"
                className="w-20 border-0 border-b border-solid border-subtle pb-2 text-[11px] font-medium uppercase tracking-wider text-muted"
              >
                Price
              </Column>
              <Column
                align="right"
                className="w-22 border-0 border-b border-solid border-subtle pb-2 text-[11px] font-medium uppercase tracking-wider text-muted"
              >
                Total
              </Column>
            </Row>

            {order.items.map((item, idx) => (
              <Row
                key={item.name}
                className="align-top"
                {...(idx === 0 ? thEach("item : ${order.items}") : thRemove())}
              >
                <Column className="pt-4 pr-2">
                  <Text
                    className="m-0 text-sm font-medium text-foreground"
                    {...thText("${item.name}")}
                  >
                    {item.name}
                  </Text>
                  <Text
                    className="m-0 mt-0.5 text-xs text-muted"
                    {...thText("${item.description}")}
                  >
                    {item.description}
                  </Text>
                </Column>
                <Column
                  align="right"
                  className="w-12 pt-4 text-sm text-foreground"
                >
                  <span {...thText("${item.amount}")}>{item.amount}</span>
                </Column>
                <Column
                  align="right"
                  className="w-20 pt-4 text-sm text-foreground"
                >
                  <span {...thText(eurExpr("item.price"))}>
                    {formatEur(item.price)}
                  </span>
                  {item.discount > 0 && (
                    <div
                      className="mt-0.5 text-xs text-muted"
                      {...thIf("${item.discount > 0}")}
                      {...thText("|−${item.discount}%|")}
                    >
                      −{item.discount}%
                    </div>
                  )}
                </Column>
                <Column
                  align="right"
                  className="w-22 pt-4 text-sm font-medium text-foreground"
                >
                  <span {...thText(eurExpr("item.lineTotal"))}>
                    {formatEur(item.lineTotal)}
                  </span>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr className="mt-6 mb-4 border-subtle" />

          <Section>
            <Row>
              <Column className="text-sm text-muted">Subtotal</Column>
              <Column align="right" className="text-sm text-foreground">
                <span {...thText(eurExpr("order.subtotal"))}>
                  {formatEur(order.subtotal)}
                </span>
              </Column>
            </Row>
            <Row className="mt-1.5">
              <Column className="text-sm text-muted">Discount</Column>
              <Column align="right" className="text-sm text-foreground">
                <span {...thText(eurExpr("order.totalDiscount", "−€"))}>
                  −{formatEur(order.totalDiscount)}
                </span>
              </Column>
            </Row>
            <Row className="mt-3">
              <Column className="text-base font-semibold text-foreground">
                Total
              </Column>
              <Column
                align="right"
                className="text-base font-semibold text-foreground"
              >
                <span {...thText(eurExpr("order.total"))}>
                  {formatEur(order.total)}
                </span>
              </Column>
            </Row>
          </Section>

          <Hr className="my-6 border-subtle" />

          <Text className="m-0 text-sm text-foreground">
            Questions about your order? Just reply to this email — we read every
            message.
          </Text>
          <Text className="mt-4 mb-0 text-xs text-muted">
            © MicroMarket · powered by Noser Bulgaria
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

const sampleOrder: Order = {
  number: "ORD-100423",
  date: "23 April 2026",
  // Keep a discounted item first: it becomes the Thymeleaf th:each template
  // row, so its HTML must contain the discount span for runtime evaluation.
  items: [
    {
      name: "Cold-Pressed Olive Oil 500ml",
      description: "Extra virgin, Puglia single-estate",
      price: 14.9,
      discount: 10,
      amount: 1,
      lineTotal: 13.41,
    },
    {
      name: "Organic Tomato Paste",
      description: "Italian San Marzano, 400g jar",
      price: 6.5,
      discount: 0,
      amount: 2,
      lineTotal: 13.0,
    },
    {
      name: "Handmade Sourdough",
      description: "24h fermented, stone-baked",
      price: 4.2,
      discount: 0,
      amount: 3,
      lineTotal: 12.6,
    },
  ],
  subtotal: 40.5,
  totalDiscount: 1.49,
  total: 39.01,
};

OrderConfirmationEmail.PreviewProps = {
  order: sampleOrder,
} satisfies OrderConfirmationEmailProps;

export default OrderConfirmationEmail;
