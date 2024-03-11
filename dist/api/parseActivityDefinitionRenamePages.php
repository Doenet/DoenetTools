<?php

function parse_activity_definition_rename_pages($activity_xml) {

  // In old cases, could have non-standard XML, like isSinglePage as an attribute by itself.
  // We can remove these kludge once we're sure content compiled before April 2023
  // is not going to be remixed.

  $activity_xml = preg_replace(
    '/isSinglePage(\s*[^=])/',
    'isSinglePage="true"$1',
    $activity_xml
  );

  $activity_xml = preg_replace(
    '/shuffleItemWeights(\s*[^=])/',
    'shuffleItemWeights="true"$1',
    $activity_xml
  );

  $activity_object = new SimpleXMLElement($activity_xml);

  if($activity_object["type"] != "activity") {
    return [
      'success' => false,
      'message' => "Invalid activity definition"
    ];
  }

  $activity_definition = [
    "type" => "activity",
    "draftCid" => NULL,
    "assignedCid" => NULL,
  ];

  // SimpleXMLElement seems to be ignoring the xmlns, so just grab it directly from string
  if(preg_match('/xmlns="https:\/\/doenet.org\/spec\/doenetml\/v(\d+\.\d+\.\d+)/', $activity_xml, $matches)) {
    $activity_definition["version"] = $matches[1];
  }

  if($activity_object["itemWeights"]) {
  $activity_definition["item_weights"] = explode(" ", $activity_object["itemWeights"]);
  }

  if ($activity_object["shuffleItemWeights"]) {
    $activity_definition["shuffleItemWeights"] = true;
  }

  if ($activity_object["numVariants"]) {
    $activity_definition["numVariants"] = (string)$activity_object["itemWeights"];
  }


  if ($activity_object["isSinglePage"]) {
    $activity_definition["isSinglePage"] = true;
  } else {
    $activity_definition["isSinglePage"] = false;
  }

  $renamed_pages = [];

  $activity_definition["content"] = content_from_order($activity_object, $renamed_pages, $first_page_id);


  return [
    "success" => TRUE,
    "activity_definition" => $activity_definition,
    "renamed_pages" => $renamed_pages,
    "first_page_id" => $first_page_id,
  ];

}



function content_from_order($order, &$renamed_pages, &$first_page_id) {
  $content = [];

  foreach ( $order->children() as $node ) { 

    $tag_name = $node->getName();

    if($tag_name == "page") {
      $newPageId = include 'randomId.php';
      $newPageId = '_' . $newPageId;
      array_push($content, $newPageId);
      $renamed_pages[(string)$node["cid"]] = [
        "newPageId" => $newPageId,
        "label" => $node["label"]
      ];


      if(!$first_page_id) {
        $first_page_id = $newPageId;
      }

    } else if($tag_name == "order") {
      $orderDoenetId = include 'randomId.php';
      $orderDoenetId = '_' . $orderDoenetId;
      $new_order = [
        'doenetId' => $orderDoenetId,
        'behavior' => (string)$node["behavior"],
        'numberToSelect' => (string)$node["numberToSelect"],
        'withReplacement' => (string)$node["withReplacement"],
        'content' => content_from_order($node, $renamed_pages, $first_page_id)
      ];
      array_push($content, $new_order);
      
    } else {
      // skip any unrecognized content
    }
  }
  return $content;
}

?>
