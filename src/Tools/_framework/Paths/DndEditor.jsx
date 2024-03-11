import React, { useCallback, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Card,
  CardBody,
  ChakraProvider,
  HStack,
  Heading,
  Icon,
  Image,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { BsGripVertical } from "react-icons/bs";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function PageCardContainer() {
  const [cards, setCards] = useState([
    {
      id: 1,
      imgSrc:
        "https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
      heading: "One",
      description:
        "Caffè latte is a coffee beverage of Italian origin made with espresso and steamed milk.",
    },
    {
      id: 2,
      imgSrc:
        "https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
      heading: "Two",
      description:
        "Caffè latte is a coffee beverage of Italian origin made with espresso and steamed milk.",
    },
    {
      id: 3,
      imgSrc:
        "https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
      heading: "Three",
      description: "Three",
    },
  ]);

  const findCard = useCallback(
    (id) => {
      const card = cards.filter((c) => c.id === id)[0];

      return {
        card,
        index: cards.indexOf(card),
      };
    },
    [cards],
  );

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const draggedCardInfo = newCards[dragIndex];
      newCards.splice(dragIndex, 1);
      newCards.splice(hoverIndex, 0, draggedCardInfo);
      return newCards;
    });
  }, []);

  return (
    <Stack>
      {cards.map((card, index) => {
        return (
          <PageCard
            key={card.id}
            index={index}
            id={card.id}
            imgSrc={card.imgSrc}
            heading={card.heading}
            description={card.description}
            moveCard={moveCard}
            findCard={findCard}
          />
        );
      })}
    </Stack>
  );
}

function PageCard({
  imgSrc,
  heading,
  description,
  id,
  moveCard,
  index,
  findCard,
}) {
  const ItemTypes = {
    CARD: "card",
  };
  const originalIndex = findCard(id).index;
  const ref = useRef(null);
  const handleRef = useRef(null);
  const [, drop] = useDrop({
    // const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    // collect(monitor) {
    //   return {
    //     handlerId: monitor.getHandlerId(),
    //   };
    // },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag, preview] = useDrag(
    {
      type: ItemTypes.CARD,
      item: () => {
        return { id, index, originalIndex };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { index: droppedIndex, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          //Move back if drop outside of drop zones
          moveCard(droppedIndex, originalIndex);
        }
      },
    },
    [id, moveCard, originalIndex],
  );
  const opacity = isDragging ? 0 : 1;
  drag(handleRef);
  // drag(drop(ref));
  drop(preview(ref));
  return (
    <Card
      ref={ref}
      opacity={opacity}
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      w="500px"
      h="100px"
    >
      <Image
        cursor="pointer"
        objectFit="cover"
        maxW={{ base: "100%", sm: "200px" }}
        src={imgSrc}
        alt="Caffe Latte"
      />

      <Stack>
        <CardBody p="8px" cursor="pointer">
          <Heading size="md">{heading}</Heading>

          <Text fontSize="sm" py="2" width="100%">
            {description}
          </Text>
        </CardBody>
      </Stack>
      <Spacer />
      <HStack
        // ref={drag}
        ref={handleRef}
        cursor="move"
        height="100%"
        width="24px"
        bg="gray.600"
      >
        <Icon boxSize={6} as={BsGripVertical} color="gray.100" />
      </HStack>
    </Card>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(
  <>
    <ChakraProvider>
      <DndProvider backend={HTML5Backend}>
        <PageCardContainer />
      </DndProvider>
    </ChakraProvider>
  </>,
);
