<?php

//Recursive function that returns order ids and collection link ids
function mine_activity_for_ids($jsonArr)
{
    $linkids = [];
    $orderids = [];
    $pageids = [];
    $collectionDoenetIds = [];
    if (count($jsonArr) > 0) {
        $jsonContent = $jsonArr['content'];
        foreach ($jsonContent as $content) {
            if (is_string($content)) {
                array_push($pageids, $content);
            } else if ($content['type'] == 'collectionLink') {
                array_push($linkids, $content['doenetId']);
                //Add page ids here
                foreach (
                    $content['pagesByCollectionSource']
                    as $key => $value
                ) {
                    if ($key != 'object') {
                        //Only add if not there already
                        if (!in_array($key, $collectionDoenetIds)) {
                            array_push($collectionDoenetIds, $key);
                        }
                    }

                    if (is_array($value) || is_object($value)) {
                        foreach ($value as $page) {
                            array_push($pageids, $page);
                        }
                    }
                }
            }else if ($content['type'] == 'order') {
                array_push($orderids, $content['doenetId']);
                $child_ids = mine_activity_for_ids($content);
                $linkids = array_merge($linkids, $child_ids['LinkIds']);
                $orderids = array_merge($orderids, $child_ids['OrderIds']);
                $pageids = array_merge($pageids, $child_ids['PageIds']);
                $collectionDoenetIds = array_merge(
                    $collectionDoenetIds,
                    $child_ids['CollectionIds']
                );
            }
        }
    }
    return [
        'LinkIds' => $linkids,
        'OrderIds' => $orderids,
        'PageIds' => $pageids,
        'CollectionIds' => $collectionDoenetIds,
    ];
}

?>
