# TaşıtPOS AWS güvenlik temeli

Bu Terraform şablonu internet trafiğini TLS 1.3 ALB ve AWS WAF üzerinden alır;
uygulama ve PostgreSQL'i iki AZ'deki private subnetlerde tutar. Uygulama dışarıya
NAT Gateway üzerinden çıkar. RDS ve özel belge bucket'ı KMS ile şifrelenir; S3
public access tamamen kapalıdır. CloudTrail, GuardDuty ve SNS güvenlik bildirimleri
etkindir.

Şablon ECS cluster ve target group'u hazırlar. Uygulamanın imajı, ECS task/service,
Route 53 zone kaydı ve kurumun IAM rolleri ortama özgü oldukları için dağıtım
pipeline'ında ayrıca bağlanmalıdır.

```bash
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

`apply` AWS üzerinde ücretli kaynaklar oluşturur. Önce kurum hesabında plan,
maliyet, IAM ve ağ adresleri gözden geçirilmelidir.
