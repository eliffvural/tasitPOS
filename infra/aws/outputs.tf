output "alb_dns_name" { value = aws_lb.app.dns_name }
output "private_subnet_ids" { value = values(aws_subnet.private)[*].id }
output "app_security_group_id" { value = aws_security_group.app.id }
output "ecs_cluster_arn" { value = aws_ecs_cluster.app.arn }
output "database_secret_arn" {
  value     = aws_db_instance.postgres.master_user_secret[0].secret_arn
  sensitive = true
}
output "document_bucket" { value = aws_s3_bucket.documents.id }
output "kms_key_arn" { value = aws_kms_key.data.arn }
