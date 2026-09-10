/** Platforms the company owns, and the product library it deploys from. */

/** Ansofra facts as published on Packagist and in the company's own docs. */
export const ANSOFRA = {
  package: 'newdich/ansofra',
  packagist: 'https://packagist.org/packages/newdich/ansofra',
  repo: 'https://github.com/samnewdich/newdich-ansofra',
  install: 'composer require newdich/ansofra',
  spec: [
    ['Package', 'newdich/ansofra'],
    ['Pattern', 'CQRS — commands and queries separated, products grouped as microservices'],
    ['Requires', 'PHP 8.1 or newer'],
    ['Dependencies', 'phpmailer/phpmailer, vlucas/phpdotenv — that is the whole list'],
    ['Licence', 'MIT'],
    ['Maintained by', 'Newdich Technology — created by Samuel Idebi'],
  ] as Array<[string, string]>,
  why: [
    [
      'Commands and queries are separate',
      'A write path and a read path have different shapes, different failure modes and ' +
        'different scaling needs. Ansofra keeps them apart rather than pretending one model ' +
        'serves both.',
    ],
    [
      'Products, not folders',
      'An application is a group of products; each product is a self-contained service with ' +
        'its own commands, queries and routes. Splitting one out later is a move, not a rewrite.',
    ],
    [
      'Two dependencies',
      'Mail and environment variables. Everything else is the standard library and your ' +
        'code, which is why upgrades are boring.',
    ],
    [
      'Built on real deadlines',
      'It exists because the same scaffolding kept being rewritten across client projects. ' +
        'The company’s own figure is that it speeds development up by around 60%.',
    ],
  ] as Array<[string, string]>,
  quickstart: `// products/Billing/Commands/IssueInvoice.php
namespace App\\Products\\Billing\\Commands;

use Ansofra\\Command;

final class IssueInvoice extends Command
{
    public function handle(array $input): array
    {
        $invoice = $this->repository->create([
            'customer_id' => $input['customer_id'],
            'amount_kobo' => $input['amount_kobo'],   // integers only
        ]);

        $this->events->emit('invoice.issued', $invoice);

        return ['id' => $invoice['id'], 'status' => 'issued'];
    }
}`,
  roadmap: [
    ['Shipped', 'CQRS core, product scaffolding, routing, mail and environment handling'],
    ['Shipped', 'MIT release on Packagist with semantic versioning'],
    ['In development', 'A TypeScript port alongside the PHP release'],
    ['Planned', 'First-party CLI for scaffolding a new product'],
  ] as Array<[string, string]>,
} as const

export const APPSTORE_ITEMS = [
  'Mobile applications',
  'Desktop applications for macOS, Linux and Windows',
  'Web applications',
  'Books',
  'Games',
  'Bots',
]

/** The product library the company lists on its site. */
export const PRODUCTS: Array<[string, string, string, number[]]> = [
  ['Framework', 'Ansofra', 'A web development framework built on the CQRS pattern.', [0]],
  ['Library', 'NAMY CSS', 'A predefined-class library for building front-ends fast.', [1]],
  ['API', 'Developer APIs', 'Documented APIs for businesses to build against.', [2]],
  ['Wallet', 'Web3 wallet', 'Decentralised wallets for storing digital assets.', [3]],
  [
    'Exchange',
    'Asset exchange',
    'Digital asset exchange platforms, centralised and decentralised.',
    [0, 1],
  ],
  [
    'P2P',
    'P2P trading',
    'Peer-to-peer trading software with escrow and dispute handling.',
    [1, 2],
  ],
  ['Vision', 'Face detection', 'Face detection and matching for identity recognition.', [2, 3]],
  ['Gaming', 'Blockchain games', 'Games across mobile, web and Telegram.', [0, 3]],
  [
    'Bots',
    'Chat bots',
    'Intelligent automation and chatbots that carry real workflows.',
    [1, 3],
  ],
  [
    'Testing',
    'Traffic bot',
    'Automation that simulates web and network traffic for performance testing.',
    [0, 2],
  ],
  ['Ads', 'Ads manager', 'Advertisement management tuned for better campaign metrics.', [2]],
  ['Commerce', 'E-commerce', 'Storefronts and order flows, including LAN point-of-sale.', [0]],
  ['Analytics', 'Tracking', 'Production-based tracking and analytics.', [1]],
  [
    'Payments',
    'Payment gateway',
    'Collection and settlement, with reconciliation behind it.',
    [3],
  ],
]
