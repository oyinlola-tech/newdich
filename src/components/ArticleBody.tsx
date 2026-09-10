/**
 * The article renderer. Block types are closed — see src/data/insights.ts —
 * so a new kind of block is a deliberate addition here rather than arbitrary
 * markup arriving from the data layer.
 */

import { anchor, type Block } from '@/data/insights'
import { Art } from '@/lib/art'
import { Code } from '@/components/ui'

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose">
      {blocks.map((block, i) => {
        switch (block.t) {
          case 'h2':
            return (
              <h2 id={anchor(block.text)} key={i}>
                {block.text}
              </h2>
            )
          case 'p':
            return <p key={i} dangerouslySetInnerHTML={{ __html: block.html }} />
          case 'ul':
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            )
          case 'ol':
            return (
              <ol key={i}>
                {block.items.map((item, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ol>
            )
          case 'quote':
            return <blockquote key={i}>{block.text}</blockquote>
          case 'code':
            return <Code key={i} caption={block.caption} code={block.code} />
          case 'art':
            return (
              <figure className="device" key={i}>
                <div className="device-body">
                  <Art name={block.key} />
                </div>
              </figure>
            )
        }
      })}
    </div>
  )
}
