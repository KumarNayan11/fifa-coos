CREATE POLICY "knowledge_articles_read" ON "knowledge_articles" FOR SELECT
USING (
  (current_setting('request.jwt.claims', true)::json->>'role')::text = ANY(SELECT unnest(audience)::text)
  OR current_setting('request.jwt.claims', true)::json->>'role' = 'admin'
);
