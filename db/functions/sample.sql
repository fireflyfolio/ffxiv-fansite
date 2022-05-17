-- FUNCTION: admin.get_product_stats(bigint)

-- DROP FUNCTION admin.get_product_stats(bigint);

CREATE OR REPLACE FUNCTION admin.get_product_stats(
	customer_id bigint)
    RETURNS jsonb
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE
AS $BODY$
DECLARE
  total_charging integer;
  total_charging_ok integer;
  total_products integer;
  total_favorite_products jsonb;
BEGIN
  SELECT COUNT(id) INTO total_charging
  FROM backend.products_sessions s WHERE s.customer_id = $1;

  SELECT COUNT(id) INTO total_charging_ok
  FROM backend.products_sessions s WHERE s.customer_id = $1 AND transaction_details IS NOT NULL;

  SELECT COUNT(DISTINCT external_product_id) INTO total_products
  FROM backend.products_sessions s WHERE s.customer_id = $1;

  SELECT COUNT(external_products->'externalProducts') INTO total_favorite_products
  FROM backend.products_favorites f WHERE f.customer_id = $1;

  RETURN json_build_object(
    'totalCharging', total_charging,
    'totalChargingOk', total_charging_ok,
    'totalProducts', total_products,
    'totalFavoriteProducts', total_favorite_products
  );
END;
$BODY$;

ALTER FUNCTION admin.get_product_stats(bigint)
    OWNER TO plave_api;

REVOKE ALL ON FUNCTION admin.get_product_stats(bigint) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION admin.get_product_stats(bigint) TO plave_api;
