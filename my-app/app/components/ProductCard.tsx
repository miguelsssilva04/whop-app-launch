import type { Product } from "@/app/lib/mock";
import { Avatar, Heading } from "@whop/react/components";
import { Card, IconButton, Text } from "frosted-ui";
import ChatTearDropDuotone from "./Icons/ChatTearDropDuotone";
import { ArrowUpCircleDuoTone } from "./Icons/ArrowUpCircleDuoTone";
import { isUpvoted, upvote, removeUpvote } from "@/app/lib/upvoteCache";
import { useEffect, useState } from "react";


type Props = { product: Product; onCardClick?: () => void; onCommentClick?: () => void };

export default function ProductCard({ product, onCardClick, onCommentClick }: Props) {
  const [upvoted, setUpvoted] = useState(false);
  useEffect(() => {
    setUpvoted(isUpvoted(product.id));
  }, [product.id]);
  return (
    <Card className="transition-shadow duration-400 hover:shadow-[0_0_20px_1px] hover:shadow-orange-500/25 cursor-pointer" onClick={onCardClick}
    >
      <div className="flex gap-4 p-2">
        <Avatar
          src={product.image}
          alt={product.name}
          size="5"
          fallback={product.name.charAt(0)}
          className="h-16 w-16 rounded object-cover"
          variant="square"
        />
        <div className="flex-1">
          <Heading as="h3" size="4" weight="semi-bold">{product.name}</Heading>
          <Text as="p" size="3" weight="light">{product.description}</Text>
          {product.category && (
            <Text as="p" size="2" weight="light" color="gray">
              {product.target} · {product.category}
            </Text>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <IconButton
            variant={upvoted ? "classic" : "surface"}
            color={upvoted ? "orange" : "gray"}
            size="4"
            style={{ flexDirection: "column" }}
            onClick={(e) => {
              e.stopPropagation();
              if (upvoted) {
                removeUpvote(product.id);
                setUpvoted(false);
              } else {
                upvote(product.id);
                setUpvoted(true);
              }
            }}
          >
            <ArrowUpCircleDuoTone size={24} color="white" />
            <Text as="p" size="2" weight="light">
              {product.upvotes}
            </Text>
          </IconButton>
          <IconButton
            variant="surface"
            color="gray"
            size="4"
            style={{ flexDirection: "column" }}
            onClick={(e) => { e.stopPropagation(); onCommentClick?.(); }}
          >
            <ChatTearDropDuotone size={24} color="white" />
            <Text as="p" size="2" weight="light">
              {product.comments}
            </Text>
          </IconButton>
        </div>
      </div>
    </Card>
  );
}
